import datetime

from app import db
from app.api import api_blueprint
from app.database.models import Blacklist, User
from app.utils.validator import edit_user_schema, login_schema, register_schema, validateObject
from flask import request
from flask.globals import session
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_raw_jwt,
    jwt_refresh_token_required,
    jwt_required,
)


def get_current_user():
    return User.query.filter_by(id=get_jwt_identity()).first()


@api_blueprint.route("/users/test", methods=["GET"])
def test():
    return {"message": "hello teknik8"}, 200


@api_blueprint.route("/users/test_auth", methods=["GET"])
@jwt_required
def test_auth():
    return {"message": "you are authenticated"}, 200


@api_blueprint.route("/users/login", methods=["POST"])
def login():
    json_dict = request.get_json(force=True)

    validate_msg = validateObject(login_schema, json_dict)
    if validate_msg != None:
        return {"message": validate_msg}, 400

    email = json_dict["email"]
    password = json_dict["password"]
    user = User.query.filter_by(email=email).first()

    # Dont show the user that the email was correct unless the password was also correct
    if not user:
        return {"message": "The email or password you entered is incorrect."}, 401

    if not user.is_correct_password(password):
        return {"message": "The email or password you entered is incorrect."}, 401

    expires = datetime.timedelta(days=7)
    access_token = create_access_token(identity=user.id, expires_delta=expires)
    refresh_token = create_refresh_token(identity=user.id)
    return (
        {"id": user.id, "access_token": access_token, "refresh_token": refresh_token},
        200,
    )


@api_blueprint.route("/users/logout", methods=["POST"])
@jwt_required
def logout():
    jti = get_raw_jwt()["jti"]

    db.session.add(Blacklist(jti))
    db.session.commit()
    return {"message": "message fully logged out"}, 200


@api_blueprint.route("/users/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    ret = {"access_token": create_access_token(identity=current_user)}
    return ret, 200


@api_blueprint.route("/users/", methods=["POST"])
def create():
    json_dict = request.get_json(force=True)

    validate_msg = validateObject(register_schema, json_dict)
    if validate_msg != None:
        return {"message": validate_msg}, 400

    existing_user = User.query.filter_by(email=json_dict["email"]).first()

    if existing_user != None:
        return {"message": "User already exists"}, 400

    user = User(json_dict["email"], json_dict["password"])
    db.session.add(user)
    db.session.commit()

    return user.get_dict(), 200


@api_blueprint.route("/users/", methods=["PUT"])
@jwt_required
def edit():
    json_dict = request.get_json(force=True)

    validate_msg = validateObject(edit_user_schema, json_dict)
    if validate_msg != None:
        return {"message": validate_msg}, 400

    user = get_current_user()
    user.name = json_dict["name"].title()

    db.session.commit()
    return user.get_dict(), 200


@api_blueprint.route("/users/", methods=["DELETE"])
@jwt_required
def delete():
    user = get_current_user()
    db.session.delete(user)
    jti = get_raw_jwt()["jti"]
    db.session.add(Blacklist(jti))
    db.session.commit()
    return {"message": "User was deleted"}, 200


###
# Getters
###
@api_blueprint.route("/users/", defaults={"UserID": None}, methods=["GET"])
@api_blueprint.route("/users/<int:UserID>", methods=["GET"])
@jwt_required
def get(UserID):

    if UserID:
        user = User.query.filter_by(id=UserID).first()
    else:
        user = get_current_user()

    if not user:
        return {"message": "User not found"}, 404

    return user.get_dict(), 200


# Searchable, returns 10 max at default
@api_blueprint.route("/users/search", methods=["GET"])
def search():
    arguments = request.args
    query = User.query

    if "name" in arguments:
        query = query.filter(User.name.like(f"%{arguments['name']}%"))

    if "email" in arguments:
        query = query.filter(User.email.like(f"%{arguments['email']}%"))

    if "page" in arguments:
        page_size = 15
        if "page_size" in arguments:
            page_size = int(arguments["page_size"])
        query = query.limit(page_size)
        query = query.offset(int(arguments["page"]) * page_size)
    else:
        query = query.limit(15)

    return [i.get_dict() for i in query.all()], 200
