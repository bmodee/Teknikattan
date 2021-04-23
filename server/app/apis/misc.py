import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core import http_codes
from app.core.dto import MiscDTO
from app.database.models import City, Competition, ComponentType, MediaType, QuestionType, Role, User, ViewType
from flask_jwt_extended import jwt_required
from flask_restx import Resource, reqparse

api = MiscDTO.api

question_type_schema = MiscDTO.question_type_schema
media_type_schema = MiscDTO.media_type_schema
component_type_schema = MiscDTO.component_type_schema
view_type_schema = MiscDTO.view_type_schema

role_schema = MiscDTO.role_schema
city_schema = MiscDTO.city_schema


name_parser = reqparse.RequestParser()
name_parser.add_argument("name", type=str, required=True, location="json")


@api.route("/types")
class TypesList(Resource):
    def get(self):
        result = {}
        result["media_types"] = media_type_schema.dump(dbc.get.all(MediaType))
        result["component_types"] = component_type_schema.dump(dbc.get.all(ComponentType))
        result["question_types"] = question_type_schema.dump(dbc.get.all(QuestionType))
        result["view_types"] = view_type_schema.dump(dbc.get.all(ViewType))
        return result


@api.route("/roles")
class RoleList(Resource):
    @check_jwt(editor=True)
    def get(self):
        items = dbc.get.all(Role)
        return list_response(role_schema.dump(items))


@api.route("/cities")
class CitiesList(Resource):
    @check_jwt(editor=True)
    def get(self):
        items = dbc.get.all(City)
        return list_response(city_schema.dump(items))

    @check_jwt(editor=False)
    def post(self):
        args = name_parser.parse_args(strict=True)
        dbc.add.city(args["name"])
        items = dbc.get.all(City)
        return list_response(city_schema.dump(items))


@api.route("/cities/<ID>")
@api.param("ID")
class Cities(Resource):
    @check_jwt(editor=False)
    def put(self, ID):
        item = dbc.get.one(City, ID)
        args = name_parser.parse_args(strict=True)
        item.name = args["name"]
        dbc.utils.commit_and_refresh(item)
        items = dbc.get.all(City)
        return list_response(city_schema.dump(items))

    @check_jwt(editor=False)
    def delete(self, ID):
        item = dbc.get.one(City, ID)
        dbc.delete.default(item)
        items = dbc.get.all(City)
        return list_response(city_schema.dump(items))


@api.route("/statistics")
class Statistics(Resource):
    @check_jwt(editor=True)
    def get(self):
        user_count = User.query.count()
        competition_count = Competition.query.count()
        region_count = City.query.count()
        return {"users": user_count, "competitions": competition_count, "regions": region_count}, http_codes.OK
