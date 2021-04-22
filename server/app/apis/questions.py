import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import QuestionDTO
from app.core.parsers import question_parser
from app.database.models import Question
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = QuestionDTO.api
schema = QuestionDTO.schema
list_schema = QuestionDTO.list_schema


@api.route("/questions")
@api.param("competition_id")
class QuestionList(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id):
        items = dbc.get.question_list_for_competition(competition_id)
        return list_response(list_schema.dump(items))


@api.route("/slides/<slide_id>/questions")
@api.param("competition_id, slide_id")
class QuestionListForSlide(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, slide_id):
        items = dbc.get.question_list(competition_id, slide_id)
        return list_response(list_schema.dump(items))

    @check_jwt(editor=True)
    def post(self, competition_id, slide_id):
        args = question_parser.parse_args(strict=True)
        item = dbc.add.question(slide_id=slide_id, **args)
        return item_response(schema.dump(item))


@api.route("/slides/<slide_id>/questions/<question_id>")
@api.param("competition_id, slide_id, question_id")
class QuestionById(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, slide_id, question_id):
        item_question = dbc.get.question(competition_id, slide_id, question_id)
        return item_response(schema.dump(item_question))

    @check_jwt(editor=True)
    def put(self, competition_id, slide_id, question_id):
        args = question_parser.parse_args(strict=True)

        item_question = dbc.get.question(competition_id, slide_id, question_id)
        item_question = dbc.edit.default(item_question, **args)

        return item_response(schema.dump(item_question))

    @check_jwt(editor=True)
    def delete(self, competition_id, slide_id, question_id):
        item_question = dbc.get.question(competition_id, slide_id, question_id)
        dbc.delete.question(item_question)
        return {}, codes.NO_CONTENT
