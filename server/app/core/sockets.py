"""
Contains all functionality related sockets. That is starting, joining, ending, 
disconnecting from and syncing active competitions.
"""
import logging

from decorator import decorator
from flask.globals import request
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.utils import get_jwt_claims
from flask_socketio import SocketIO, emit, join_room

logger = logging.getLogger(__name__)
logger.propagate = False
logger.setLevel(logging.INFO)

formatter = logging.Formatter("[%(levelname)s] %(message)s")
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

sio = SocketIO(cors_allowed_origins="http://localhost:3000")

active_competitions = {}


def _unpack_claims():
    """
    :return: A tuple containing competition_id and view, gotten from claim
    :rtype: tuple
    """

    claims = get_jwt_claims()
    return claims["competition_id"], claims["view"]


def is_active_competition(competition_id):
    """
    :return: True if competition with competition_id is currently active else False
    :rtype: bool
    """
    return competition_id in active_competitions


def _get_sync_variables(active_competition, sync_values):
    return {key: value for key, value in active_competition.items() if key in sync_values}


@decorator
def authorize_client(f, allowed_views=None, require_active_competition=True, *args, **kwargs):
    """
    Decorator used to authorize a client that sends socket events. Check that
    the client has authorization headers, that client view gotten from claims
    is in allowed_views and that the competition the clients is in is active
    if require_active_competition is True.
    """

    try:
        verify_jwt_in_request()
    except:
        logger.error(f"Won't call function '{f.__name__}': Missing Authorization Header")
        return

    def _is_allowed(allowed, actual):
        return actual and "*" in allowed or actual in allowed

    competition_id, view = _unpack_claims()

    if require_active_competition and not is_active_competition(competition_id):
        logger.error(f"Won't call function '{f.__name__}': Competition '{competition_id}' is not active")
        return

    allowed_views = allowed_views or []
    if not _is_allowed(allowed_views, view):
        logger.error(f"Won't call function '{f.__name__}': View '{view}' is not '{' or '.join(allowed_views)}'")
        return

    return f(*args, **kwargs)


@sio.event
@authorize_client(require_active_competition=False, allowed_views=["*"])
def connect() -> None:
    """
    Connect to a active competition. If competition with competition_id is not active,
    start it if client is an operator, otherwise ignore it.
    """

    competition_id, view = _unpack_claims()

    if is_active_competition(competition_id):
        active_competition = active_competitions[competition_id]
        active_competition["client_count"] += 1
        join_room(competition_id)
        emit("sync", _get_sync_variables(active_competition, ["slide_order", "timer"]))
        logger.info(f"Client '{request.sid}' with view '{view}' joined competition '{competition_id}'")
    elif view == "Operator":
        join_room(competition_id)
        active_competitions[competition_id] = {
            "client_count": 1,
            "slide_order": 0,
            "timer": {
                "value": None,
                "enabled": False,
            },
            "show_scoreboard": False,
        }
        logger.info(f"Client '{request.sid}' with view '{view}' started competition '{competition_id}'")
    else:
        logger.error(
            f"Client '{request.sid}' with view '{view}' tried to join non active competition '{competition_id}'"
        )


@sio.event
@authorize_client(allowed_views=["*"])
def disconnect() -> None:
    """
    Remove client from the active_competition it was in. Delete active_competition if no
    clients are connected to it.
    """

    competition_id, _ = _unpack_claims()
    active_competitions[competition_id]["client_count"] -= 1
    logger.info(f"Client '{request.sid}' disconnected from competition '{competition_id}'")

    if active_competitions[competition_id]["client_count"] <= 0:
        del active_competitions[competition_id]
        logger.info(f"No people left in active_competition '{competition_id}', ended active_competition")


@sio.event
@authorize_client(allowed_views=["Operator"])
def end_presentation() -> None:
    """
    End a active_competition by sending end_presentation to all connected clients.
    """

    competition_id, _ = _unpack_claims()
    emit("end_presentation", room=competition_id, include_self=True)


@sio.event
@authorize_client(allowed_views=["Operator"])
def sync(data) -> None:
    """
    Sync active_competition for all clients connected to competition.
    """

    competition_id, view = _unpack_claims()
    active_competition = active_competitions[competition_id]

    for key, value in data.items():
        if key not in active_competition:
            logger.warning(f"Invalid sync data: '{key}':'{value}'")

        active_competition[key] = value

    emit("sync", _get_sync_variables(active_competition, data), room=competition_id, include_self=True)
    logger.info(
        f"Client '{request.sid}' with view '{view}' synced values {_get_sync_variables(active_competition, data)} in competition '{competition_id}'"
    )
