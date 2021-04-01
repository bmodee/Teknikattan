import app.core.controller as dbc
from app.core.dto import MiscDTO
from app.core.models import City, MediaType, QuestionType, Role
from flask_jwt_extended import jwt_required
from flask_restx import Resource, reqparse

api = MiscDTO.api

question_type_model = MiscDTO.question_type_model
media_type_model = MiscDTO.media_type_model
role_model = MiscDTO.role_model
city_model = MiscDTO.city_model


name_parser = reqparse.RequestParser()
name_parser.add_argument("name", type=str, required=True, location="json")


@api.route("/media_types")
class MediaTypeList(Resource):
    @jwt_required
    @api.marshal_with(media_type_model)
    def get(self):
        return MediaType.query.all()


@api.route("/question_types")
class QuestionTypeList(Resource):
    @jwt_required
    @api.marshal_with(question_type_model)
    def get(self):
        return QuestionType.query.all()


@api.route("/roles")
class RoleList(Resource):
    @jwt_required
    @api.marshal_with(role_model)
    def get(self):
        return Role.query.all()


@api.route("/cities")
class CitiesList(Resource):
    @jwt_required
    @api.marshal_with(city_model)
    def get(self):
        return City.query.all()

    @jwt_required
    @api.marshal_with(role_model)
    def post(self):
        args = name_parser.parse_args(strict=True)
        dbc.add.default(City(args["name"]))
        return City.query.all()


@api.route("/cities/<ID>")
@api.param("ID")
class Cities(Resource):
    @jwt_required
    @api.marshal_with(city_model)
    def put(self, ID):
        item = City.query.filter(City.id == ID).first()
        args = name_parser.parse_args(strict=True)
        item.name = args["name"]
        dbc.edit.default(item)
        return City.query.all()

    @jwt_required
    @api.marshal_with(city_model)
    def delete(self, ID):
        item = City.query.filter(City.id == ID).first()
        dbc.delete.default(item)
        return City.query.all()
