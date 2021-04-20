import app.database.controller as dbc
from app.core import db
from app.database.models import Competition, Slide, Team, ViewType
from flask.globals import request
from flask_socketio import SocketIO, emit, join_room

# Presentation is an active competition


sio = SocketIO(cors_allowed_origins="http://localhost:3000")

presentations = {}


@sio.on("connect")
def connect():
    print(f"[Connected]: {request.sid}")


@sio.on("disconnect")
def disconnect():
    for competition_id, presentation in presentations.items():
        if request.sid in presentation["clients"]:
            del presentation["clients"][request.sid]
            break

    if presentations and not presentations[competition_id]["clients"]:
        del presentations[competition_id]

    print(f"{presentations=}")

    print(f"[Disconnected]: {request.sid}")


@sio.on("start_presentation")
def start_presentation(data):
    competition_id = data["competition_id"]

    # TODO: Do proper error handling
    if competition_id in presentations:
        print("THAT PRESENTATION IS ALREADY ACTIVE")
        return

    presentations[competition_id] = {
        "clients": {request.sid: {"view_type": "Operator"}},
        "slide": None,
        "timer": {"enabled": False, "start_value": None, "value": None},
    }

    print(f"{presentations=}")

    join_room(competition_id)
    print(f"[start_presentation]: {request.sid} -> {competition_id}.")


@sio.on("end_presentation")
def end_presentation(data):
    competition_id = data["competition_id"]

    if competition_id not in presentations:
        print("NO PRESENTATION WITH THAT NAME EXISTS")
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        print("YOU DONT HAVE ACCESS TO DO THAT")
        return

    del presentations[competition_id]

    print(f"{presentations=}")

    emit("end_presentation", room=competition_id, include_self=True)


@sio.on("join_presentation")
def join_presentation(data):
    team_view_id = 1
    code = data["code"]
    item_code = dbc.get.code_by_code(code)

    # TODO: Do proper error handling
    if not item_code:
        print("CODE DOES NOT EXIST")
        return

    competition_id = (
        item_code.pointer
        if item_code.view_type_id != team_view_id
        else db.session.query(Team).filter(Team.id == item_code.pointer).one().competition_id
    )

    if competition_id not in presentations:
        print("THAT COMPETITION IS CURRENTLY NOT ACTIVE")
        return

    if request.sid in presentations[competition_id]["clients"]:
        print("CLIENT ALREADY IN COMPETITION")
        return

    # TODO: Write function in database controller to do this
    view_type_name = db.session.query(ViewType).filter(ViewType.id == item_code.view_type_id).one().name

    presentations[competition_id]["clients"][request.sid] = {"view_type": view_type_name}
    join_room(competition_id)

    print(f"{presentations=}")

    print(f"[Join presentation]: {request.sid} -> {competition_id}. {view_type_name=}")


@sio.on("set_slide")
def set_slide(data):
    competition_id = data["competition_id"]
    slide_order = data["slide_order"]

    if competition_id not in presentations:
        print("CANT SET SLIDE IN NON ACTIVE COMPETITION")
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        print("YOU DONT HAVE ACCESS TO DO THAT")
        return

    num_slides = db.session.query(Slide).filter(Slide.competition_id == competition_id).count()

    if not (0 <= slide_order < num_slides):
        print("CANT CHANGE TO NON EXISTENT SLIDE")
        return

    presentations[competition_id]["slide"] = slide_order

    print(f"{presentations=}")

    emit("set_slide", {"slide_order": slide_order}, room=competition_id, include_self=True)
    print(f"[Set slide]: {slide_order} -> {competition_id}")


@sio.on("set_timer")
def sync_timer(data):
    competition_id = data["competition_id"]
    timer = data["timer"]

    if competition_id not in presentations:
        print("CANT SET TIMER IN NON EXISTENT COMPETITION")
        return

    if presentations[competition_id]["clients"][request.sid]["view_type"] != "Operator":
        print("YOU DONT HAVE ACCESS TO DO THAT")
        return

    # TODO: Save timer in presentation, maybe?

    print(f"{presentations=}")

    emit("set_timer", {"timer": timer}, room=competition_id, include_self=True)
    print(f"[Set timer]: {timer=}, {competition_id=}")
