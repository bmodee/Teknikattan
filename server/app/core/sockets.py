from flask.globals import request
from flask_socketio import SocketIO, emit, join_room

sio = SocketIO(cors_allowed_origins="http://localhost:3000")


@sio.on("connect")
def connect():
    print(f"[Connected]: {request.sid}")


@sio.on("disconnect")
def disconnect():
    print(f"[Disconnected]: {request.sid}")


@sio.on("join_competition")
def join_competition(data):
    competitionID = data["competitionID"]
    join_room(data["competitionID"])
    print(f"[Join room]: {request.sid} -> {competitionID}")


@sio.on("sync_slide")
def sync_slide(data):
    slide, competitionID = data["slide"], data["competitionID"]
    emit("sync_slide", {"slide": slide}, room=competitionID, include_self=False)
    print(f"[Sync slide]: {slide} -> {competitionID}")


@sio.on("sync_timer")
def sync_timer(data):
    competitionID = data["competitionID"]
    timer = data["timer"]
    emit("sync_timer", {"timer": timer}, room=competitionID, include_self=False)
    print(f"[Sync timer]: {competitionID=} {timer=}")
