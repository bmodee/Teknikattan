import app.core.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import MiscDTO
from app.core.models import City, MediaType, QuestionType, Role
from flask_jwt_extended import jwt_required
from flask_restx import Resource, reqparse

api = MiscDTO.api

question_type_schema = MiscDTO.question_type_schema
media_type_schema = MiscDTO.media_type_schema
role_schema = MiscDTO.role_schema
city_schema = MiscDTO.city_schema


name_parser = reqparse.RequestParser()
name_parser.add_argument("name", type=str, required=True, location="json")


@api.route("/media_types")
class MediaTypeList(Resource):
    @jwt_required
    def get(self):
        items = MediaType.query.all()
        return list_response(media_type_schema.dump(items))


@api.route("/question_types")
class QuestionTypeList(Resource):
    @jwt_required
    def get(self):
        items = QuestionType.query.all()
        return list_response(question_type_schema.dump(items))


@api.route("/roles")
class RoleList(Resource):
    @jwt_required
    def get(self):
        items = Role.query.all()
        return list_response(role_schema.dump(items))


@api.route("/cities")
class CitiesList(Resource):
    @jwt_required
    def get(self):
        items = City.query.all()
        return list_response(city_schema.dump(items))

    @jwt_required
    def post(self):
        args = name_parser.parse_args(strict=True)
        dbc.add.city(args["name"])
        items = City.query.all()
        return list_response(city_schema.dump(items))


@api.route("/cities/<ID>")
@api.param("ID")
class Cities(Resource):
    @jwt_required
    def put(self, ID):
        item = City.query.filter(City.id == ID).first()
        args = name_parser.parse_args(strict=True)
        item.name = args["name"]
        dbc.commit_and_refresh(item)
        items = City.query.all()
        return list_response(city_schema.dump(items))

    @jwt_required
    def delete(self, ID):
        item = City.query.filter(City.id == ID).first()
        dbc.delete.default(item)
        items = City.query.all()
        return list_response(city_schema.dump(items))
