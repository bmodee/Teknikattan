import app.database.controller as dbc
from app.core import db
from app.database.models import Competition, Slide, Team, ViewType, Code
from flask.globals import request
from flask_socketio import SocketIO, emit, join_room
import logging

logger = logging.getLogger(__name__)
logger.propagate = False
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s] %(funcName)s: %(message)s')
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

sio = SocketIO(cors_allowed_origins="http://localhost:3000")

presentations = {}


@sio.on("connect")
def connect():
    logger.info(f"Client '{request.sid}' connected")


@sio.on("disconnect")
def disconnect():
    for competition_id, presentation in presentations.items():
        if request.sid in presentation["clients"]:
            del presentation["clients"][request.sid]
            logger.debug(f"Client '{request.sid}' left presentation '{competition_id}'")
            break

    if presentations and not presentations[competition_id]["clients"]:
        del presentations[competition_id]
        logger.info(f"No people left in presentation '{competition_id}', ended presentation")

    logger.info(f"Client '{request.sid}' disconnected")


@sio.on("start_presentation")
def start_presentation(data):
    competition_id = data["competition_id"]

    if competition_id in presentations:
        logger.error(f"Client '{request.sid}' failed to start competition '{competition_id}', presentation already active")
        return

    presentations[competition_id] = {
        "clients": {request.sid: {"view_type": "Operator"}},
        "slide": None,
        "timer": {"enabled": False, "start_value": None, "value": None},
    }

    join_room(competition_id)
    logger.debug(f"Client '{request.sid}' joined room {competition_id}")

    logger.info(f"Client '{request.sid}' started competition '{competition_id}'")

@sio.on("end_presentation")
def end_presentation(data):
    competition_id = data["competition_id"]

    if competition_id not in presentations:
        logger.error(f"Client '{request.sid}' failed to end presentation '{competition_id}', no such presentation exists")
        return

    if request.sid not in presentations[competition_id]["clients"]:
        logger.error(f"Client '{request.sid}' failed to end presentation '{competition_id}', client not in presentation")
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
def join_presentation(data):
    team_view_id = 1
    code = data["code"]
    item_code = db.session.query(Code).filter(Code.code == code).first()

    if not item_code:
        logger.error(f"Client '{request.sid}' failed to join presentation with code '{code}', no such code exists")
        return

    competition_id = (
        item_code.pointer
        if item_code.view_type_id != team_view_id
        else db.session.query(Team).filter(Team.id == item_code.pointer).one().competition_id
    )

    if competition_id not in presentations:
        logger.error(f"Client '{request.sid}' failed to join presentation '{competition_id}', no such presentation exists")
        return

    if request.sid in presentations[competition_id]["clients"]:
        logger.error(f"Client '{request.sid}' failed to join presentation '{competition_id}', client already in presentation")
        return

    # TODO: Write function in database controller to do this
    view_type_name = db.session.query(ViewType).filter(ViewType.id == item_code.view_type_id).one().name

    presentations[competition_id]["clients"][request.sid] = {"view_type": view_type_name}

    join_room(competition_id)
    logger.debug(f"Client '{request.sid}' joined room {competition_id}")

    logger.info(f"Client '{request.sid}' joined competition '{competition_id}'")


@sio.on("set_slide")
def set_slide(data):
    competition_id = data["competition_id"]
    slide_order = data["slide_order"]

    if competition_id not in presentations:
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', no such presentation exists")
        return

    if request.sid not in presentations[competition_id]["clients"]:
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client not in presentation")
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client is not operator")
        return

    num_slides = db.session.query(Slide).filter(Slide.competition_id == competition_id).count()

    if not (0 <= slide_order < num_slides):
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', slide number {slide_order} does not exist")
        return

    presentations[competition_id]["slide"] = slide_order

    emit("set_slide", {"slide_order": slide_order}, room=competition_id, include_self=True)
    logger.debug(f"Emitting event 'set_slide' to room {competition_id} including self")

    logger.info(f"Client '{request.sid}' set slide '{slide_order}' in competition '{competition_id}'")


@sio.on("set_timer")
def set_timer(data):
    competition_id = data["competition_id"]
    timer = data["timer"]

    if competition_id not in presentations:
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', no such presentation exists")
        return

    if request.sid not in presentations[competition_id]["clients"]:
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client not in presentation")
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        logger.error(f"Client '{request.sid}' failed to set slide in presentation '{competition_id}', client is not operator")
        return

    # TODO: Save timer in presentation, maybe?

    emit("set_timer", {"timer": timer}, room=competition_id, include_self=True)
    logger.debug(f"Emitting event 'set_timer' to room {competition_id} including self")

    logger.info(f"Client '{request.sid}' set timer '{timer}' in presentation '{competition_id}'")

