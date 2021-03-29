###
# Admin stuff placed here for later use
# No need to implement this before the application is somewhat done
###

import app.database.controller as dbc
import app.utils.http_codes as codes
from app import db
from app.api import admin_required, api_blueprint, object_response, query_response, text_response
from app.database.models import Blacklist, City, Competition, Role, User
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


@api_blueprint.route("/competitions/<int:id>", methods=["GET"])
@jwt_required
def get(id):
    item = Competition.query.filter(Competition.id == id).first()
    if not item:
        return text_response("Competition not found", codes.NOT_FOUND)

    return query_response(item)


@api_blueprint.route("/competitions", methods=["POST"])
@jwt_required
def create():
    json_dict = request.get_json(force=True)

    name = json_dict.get("name")
    city_id = json_dict.get("city_id")
    year = json_dict.get("year", 2020)
    style_id = json_dict.get("style_id", 0)

    dbc.add.competition(name, year, style_id, city_id)

    item = Competition.query.filter(Competition.name == name).first()
    return query_response(item)
