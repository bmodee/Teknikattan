"""
Contains all functionality related sockets. That is starting and ending a presentation, 
joining and leaving a presentation and syncing slides and timer bewteen all clients
connected to the same presentation.
"""
import logging
from functools import wraps
from typing import Dict

from app.core import db
from app.database.models import Code, Slide, ViewType
from flask.globals import request
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.utils import get_jwt_claims
from flask_socketio import SocketIO, emit, join_room

logger = logging.getLogger(__name__)
logger.propagate = False
logger.setLevel(logging.INFO)

formatter = logging.Formatter("[%(levelname)s] %(funcName)s: %(message)s")
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

sio = SocketIO(cors_allowed_origins="http://localhost:3000")

presentations = {}


def _is_allowed(allowed, actual):
    return actual and "*" in allowed or actual in allowed


def protect_route(allowed_views=None):
    def wrapper(f):
        @wraps(f)
        def inner(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except:
                logger.warning("Missing Authorization Header")
                return

            nonlocal allowed_views
            allowed_views = allowed_views or []
            claims = get_jwt_claims()
            view = claims.get("view")
            if not _is_allowed(allowed_views, view):
                logger.warning(f"View '{view}' is not allowed to access route only accessible by '{allowed_views}'")
                return

            return f(*args, **kwargs)

        return inner

    return wrapper


@sio.on("connect")
def connect() -> None:
    logger.info(f"Client '{request.sid}' connected")


@sio.on("disconnect")
def disconnect() -> None:
    """
    Remove client from the presentation it was in. Delete presentation if no
    clients are connected to it.
    """
    for competition_id, presentation in presentations.items():
        if request.sid in presentation["clients"]:
            del presentation["clients"][request.sid]
            logger.debug(f"Client '{request.sid}' left presentation '{competition_id}'")
            break

    if presentations and not presentations[competition_id]["clients"]:
        del presentations[competition_id]
        logger.info(f"No people left in presentation '{competition_id}', ended presentation")

    logger.info(f"Client '{request.sid}' disconnected")


@protect_route(allowed_views=["Operator"])
@sio.on("start_presentation")
def start_presentation(data: Dict) -> None:
    """
    Starts a presentation if that competition is currently not active.
    """

    competition_id = data["competition_id"]

    if competition_id in presentations:
        logger.error(
            f"Client '{request.sid}' failed to start competition '{competition_id}', presentation already active"
        )
        return

    presentations[competition_id] = {
        "clients": {request.sid: {"view_type": "Operator"}},
        "slide": None,
        "timer": {"enabled": False, "start_value": None, "value": None},
    }

    join_room(competition_id)
    logger.debug(f"Client '{request.sid}' joined room {competition_id}")

    logger.info(f"Client '{request.sid}' started competition '{competition_id}'")


@protect_route(allowed_views=["Operator"])
@sio.on("end_presentation")
def end_presentation(data: Dict) -> None:
    """
    End a presentation by sending end_presentation to all connected clients.

    The only clients allowed to do this is the one that started the presentation.

    Log error message if no presentation exists with the send id or if this
    client is not in that presentation.
    """
    competition_id = data["competition_id"]

    if competition_id not in presentations:
        logger.error(
            f"Client '{request.sid}' failed to end presentation '{competition_id}', no such presentation exists"
        )
        return

    if request.sid not in presentations[competition_id]["clients"]:
        logger.error(
            f"Client '{request.sid}' failed to end presentation '{competition_id}', client not in presentation"
        )
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        logger.error(f"Client '{request.sid}' failed to end presentation '{competition_id}', client is not operator")
        return

    del presentations[competition_id]
    logger.debug(f"Deleted presentation {competition_id}")

    emit("end_presentation", room=competition_id, include_self=True)
    logger.debug(f"Emitting event 'end_presentation' to room {competition_id} including self")

    logger.info(f"Client '{request.sid}' ended presentation '{competition_id}'")


@sio.on("join_presentation")
def join_presentation(data: Dict) -> None:
    """
    Join a currently active presentation.

    Log error message if given code doesn't exist, if not presentation associated
    with that code exists or if client is already in the presentation.
    """
    code = data["code"]
    item_code = db.session.query(Code).filter(Code.code == code).first()

    if not item_code:
        logger.error(f"Client '{request.sid}' failed to join presentation with code '{code}', no such code exists")
        return

    competition_id = item_code.competition_id

    if competition_id not in presentations:
        logger.error(
            f"Client '{request.sid}' failed to join presentation '{competition_id}', no such presentation exists"
        )
        return

    if request.sid in presentations[competition_id]["clients"]:
        logger.error(
            f"Client '{request.sid}' failed to join presentation '{competition_id}', client already in presentation"
        )
        return

    # TODO: Write function in database controller to do this
    view_type_name = db.session.query(ViewType).filter(ViewType.id == item_code.view_type_id).one().name

    presentations[competition_id]["clients"][request.sid] = {"view_type": view_type_name}

    join_room(competition_id)
    logger.debug(f"Client '{request.sid}' joined room {competition_id}")

    logger.info(f"Client '{request.sid}' joined competition '{competition_id}'")


@protect_route(allowed_views=["Operator"])
@sio.on("set_slide")
def set_slide(data: Dict) -> None:
    """
    Sync slides between all clients in the same presentation by sending
    set_slide to them.

    Log error if the given competition_id is not active, if client is not in
    that presentation or the client is not the one who started the presentation.
    """

    competition_id = data["competition_id"]
    slide_order = data["slide_order"]

    if competition_id not in presentations:
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', no such presentation exists"
        )
        return

    if request.sid not in presentations[competition_id]["clients"]:
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client not in presentation"
        )
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client is not operator"
        )
        return

    num_slides = db.session.query(Slide).filter(Slide.competition_id == competition_id).count()

    if not (0 <= slide_order < num_slides):
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', slide number {slide_order} does not exist"
        )
        return

    presentations[competition_id]["slide"] = slide_order

    emit("set_slide", {"slide_order": slide_order}, room=competition_id, include_self=True)
    logger.debug(f"Emitting event 'set_slide' to room {competition_id} including self")

    logger.info(f"Client '{request.sid}' set slide '{slide_order}' in competition '{competition_id}'")


@protect_route(allowed_views=["Operator"])
@sio.on("set_timer")
def set_timer(data: Dict) -> None:
    """
    Sync slides between all clients in the same presentation by sending
    set_timer to them.

    Log error if the given competition_id is not active, if client is not in
    that presentation or the client is not the one who started the presentation.
    """
    competition_id = data["competition_id"]
    timer = data["timer"]

    if competition_id not in presentations:
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', no such presentation exists"
        )
        return

    if request.sid not in presentations[competition_id]["clients"]:
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client not in presentation"
        )
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        logger.error(
            f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client is not operator"
        )
        return

    # TODO: Save timer in presentation, maybe?

    emit("set_timer", {"timer": timer}, room=competition_id, include_self=True)
    logger.debug(f"Emitting event 'set_timer' to room {competition_id} including self")

    logger.info(f"Client '{request.sid}' set timer '{timer}' in presentation '{competition_id}'")
