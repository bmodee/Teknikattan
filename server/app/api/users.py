import datetime

import app.database.controller as dbc
import app.utils.http_codes as codes
from app import db
from app.api import admin_required, api_blueprint, object_response, query_response, text_response
from app.database.models import Blacklist, City, Role, User
from app.utils.validator import edit_user_schema, login_schema, register_schema, validate_object
from flask import request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_raw_jwt,
    jwt_refresh_token_required,
    jwt_required,
)


##Helpers
def _get_current_user():
    return User.query.filter_by(id=get_jwt_identity()).first()


def _create_token(user):
    expires = datetime.timedelta(days=7)
    claims = {"role": user.role.name}

    return create_access_token(identity=user.id, expires_delta=expires, user_claims=claims)


@api_blueprint.route("/users/test", methods=["GET"])
def test():
    return text_response("hello teknik8")


@api_blueprint.route("/users/test_auth", methods=["GET"])
@jwt_required
@admin_required()
def test_auth():
    return text_response("you are authenticated")


@api_blueprint.route("/roles", methods=["GET"])
@jwt_required
def get_roles():
    return query_response(Role.query.all())


@api_blueprint.route("/users/login", methods=["POST"])
def login():
    json_dict = request.get_json(force=True)

    validate_msg = validate_object(login_schema, json_dict)
    if validate_msg is not None:
        return text_response(validate_msg, codes.BAD_REQUEST)

    email = json_dict.get("email")
    password = json_dict.get("password")
    user = User.query.filter_by(email=email).first()

    if not user or not user.is_correct_password(password):
        return text_response("Invalid email or password", codes.UNAUTHORIZED)

    access_token = _create_token(user)
    refresh_token = create_refresh_token(identity=user.id)

    response = {"id": user.id, "access_token": access_token, "refresh_token": refresh_token}
    return object_response(response)


@api_blueprint.route("/users/logout", methods=["POST"])
@jwt_required
def logout():
    jti = get_raw_jwt()["jti"]

    db.session.add(Blacklist(jti))
    db.session.commit()
    return text_response("Logged out")


@api_blueprint.route("/users/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    response = {"access_token": _create_token(current_user)}

    return object_response(response)


@api_blueprint.route("/users/", methods=["POST"])
def create():
    json_dict = request.get_json(force=True)

    validate_msg = validate_object(register_schema, json_dict)
    if validate_msg is not None:
        return text_response(validate_msg, codes.BAD_REQUEST)

    email = json_dict.get("email")
    password = json_dict.get("password")
    role = json_dict.get("role")
    city = json_dict.get("city")

    existing_user = User.query.filter(User.email == email).first()

    if existing_user is not None:
        return text_response("User already exists", codes.BAD_REQUEST)

    dbc.add.user(email, password, role, city)

    item_user = User.query.filter(User.email == email).first()

    return query_response(item_user)


@api_blueprint.route("/users/", defaults={"user_id": None}, methods=["PUT"])
@api_blueprint.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required
def edit(user_id):
    json_dict = request.get_json(force=True)

    validate_msg = validate_object(edit_user_schema, json_dict)
    if validate_msg is not None:
        return text_response(validate_msg, codes.BAD_REQUEST)

    if user_id:
        item_user = User.query.filter(User.id == user_id).first()
    else:
        item_user = _get_current_user()

    name = json_dict.get("name")
    role = json_dict.get("city")
    city = json_dict.get("password")

    if name:
        item_user.name = name.title()

    if city:
        if City.query.filter(City.name == city).first() is None:
            return text_response(f"City {city} does not exist", codes.BAD_REQUEST)
        item_user.city = city

    if role:
        if Role.query.filter(Role.name == role).first() is None:
            return text_response(f"Role {role} does not exist", codes.BAD_REQUEST)
        item_user.role = role

    db.session.commit()
    db.session.refresh(item_user)
    return query_response(item_user)


@api_blueprint.route("/users/", defaults={"user_id": None}, methods=["DELETE"])
@api_blueprint.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required
def delete(user_id):
    if user_id:
        item_user = User.query.filter(User.id == user_id).first()
    else:
        item_user = _get_current_user()

    db.session.delete(item_user)
    jti = get_raw_jwt()["jti"]
    db.session.add(Blacklist(jti))
    db.session.commit()

    return text_response("User deleted")


###
# Getters
###
@api_blueprint.route("/users/", defaults={"user_id": None}, methods=["GET"])
@api_blueprint.route("/users/<int:user_id>", methods=["GET"])
@jwt_required
def get(user_id):

    if user_id:
        user = User.query.filter(User.id == user_id).first()
    else:
        user = _get_current_user()

    if not user:
        return text_response("User not found", codes.NOT_FOUND)

    return query_response(user)


# Searchable, returns 15 max at default
@api_blueprint.route("/users/search", methods=["GET"])
@jwt_required
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

    return query_response(query.all())
