import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionAlternativeDTO
from flask_restx import Resource
from flask_restx import reqparse
from app.core.parsers import sentinel

api = QuestionAlternativeDTO.api
schema = QuestionAlternativeDTO.schema
list_schema = QuestionAlternativeDTO.list_schema

alternative_parser_add = reqparse.RequestParser()
alternative_parser_add.add_argument("text", type=str, required=True, location="json")
alternative_parser_add.add_argument("value", type=int, required=True, location="json")

alternative_parser_edit = reqparse.RequestParser()
alternative_parser_edit.add_argument("text", type=str, default=sentinel, location="json")
alternative_parser_edit.add_argument("value", type=int, default=sentinel, location="json")


@api.route("")
@api.param("competition_id, slide_id, question_id")
class QuestionAlternativeList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, question_id):
        items = dbc.get.question_alternative_list(competition_id, slide_id, question_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id, question_id):
        args = alternative_parser_add.parse_args(strict=True)
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
        args = alternative_parser_edit.parse_args(strict=True)
        item = dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id, question_id, alternative_id):
        item = dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id)
        dbc.delete.default(item)
        return {}, codes.NO_CONTENT
