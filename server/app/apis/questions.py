import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionDTO
from flask_restx import Resource
from flask_restx import reqparse
from app.core.parsers import sentinel

api = QuestionDTO.api
schema = QuestionDTO.schema
list_schema = QuestionDTO.list_schema

question_parser_add = reqparse.RequestParser()
question_parser_add.add_argument("name", type=str, default=None, location="json")
question_parser_add.add_argument("total_score", type=int, default=None, location="json")
question_parser_add.add_argument("type_id", type=int, required=True, location="json")
question_parser_add.add_argument("correcting_instructions", type=str, default=None, location="json")

question_parser_edit = reqparse.RequestParser()
question_parser_edit.add_argument("name", type=str, default=sentinel, location="json")
question_parser_edit.add_argument("total_score", type=int, default=sentinel, location="json")
question_parser_edit.add_argument("type_id", type=int, default=sentinel, location="json")
question_parser_edit.add_argument("correcting_instructions", type=str, default=sentinel, location="json")


@api.route("/questions")
@api.param("competition_id")
class QuestionList(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id):
        items = dbc.get.question_list_for_competition(competition_id)
        return list_response(list_schema.dump(items))


@api.route("/slides/<slide_id>/questions")
@api.param("competition_id, slide_id")
class QuestionListForSlide(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id, slide_id):
        items = dbc.get.question_list(competition_id, slide_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id):
        args = question_parser_add.parse_args(strict=True)
        item = dbc.add.question(slide_id=slide_id, **args)
        return item_response(schema.dump(item))


@api.route("/slides/<slide_id>/questions/<question_id>")
@api.param("competition_id, slide_id, question_id")
class QuestionById(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id, slide_id, question_id):
        item_question = dbc.get.question(competition_id, slide_id, question_id)
        return item_response(schema.dump(item_question))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, slide_id, question_id):
        args = question_parser_edit.parse_args(strict=True)

        item_question = dbc.get.question(competition_id, slide_id, question_id)
        item_question = dbc.edit.default(item_question, **args)

        return item_response(schema.dump(item_question))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id, question_id):
        item_question = dbc.get.question(competition_id, slide_id, question_id)
        dbc.delete.question(item_question)
        return {}, codes.NO_CONTENT
