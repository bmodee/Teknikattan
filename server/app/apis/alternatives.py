import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionAlternativeDTO
from flask_restx import Resource
from flask_restx import reqparse

api = QuestionAlternativeDTO.api
schema = QuestionAlternativeDTO.schema
list_schema = QuestionAlternativeDTO.list_schema

question_alternative_parser = reqparse.RequestParser()
question_alternative_parser.add_argument("text", type=str, default=None, location="json")
question_alternative_parser.add_argument("value", type=int, default=None, location="json")


@api.route("")
@api.param("competition_id, slide_id, question_id")
class QuestionAlternativeList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, question_id):
        items = dbc.get.question_alternative_list(competition_id, slide_id, question_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id, question_id):
        args = question_alternative_parser.parse_args(strict=True)
        item = dbc.add.question_alternative(**args, question_id=question_id)
        return item_response(schema.dump(item))


@api.route("/<alternative_id>")
@api.param("competition_id, slide_id, question_id, alternative_id")
class QuestionAlternatives(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, question_id, alternative_id):
        items = dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id)
        return item_response(schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, slide_id, question_id, alternative_id):
        args = question_alternative_parser.parse_args(strict=True)
        item = dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id, question_id, alternative_id):
        item = dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id)
        dbc.delete.default(item)
        return {}, codes.NO_CONTENT
