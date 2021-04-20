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
@api.param("CID")
class QuestionsList(Resource):
    @check_jwt(editor=True)
    def get(self, CID):
        items = dbc.get.question_list(CID)
        return list_response(list_schema.dump(items))


@api.route("/slides/<SID>/questions")
@api.param("CID, SID")
class QuestionsList(Resource):
    @check_jwt(editor=True)
    def post(self, SID, CID):
        args = question_parser.parse_args(strict=True)
        del args["slide_id"]

        item_slide = dbc.get.slide(CID, SID)
        item = dbc.add.question(item_slide=item_slide, **args)

        return item_response(schema.dump(item))


@api.route("/slides/<SID>/questions/<QID>")
@api.param("CID, SID, QID")
class Questions(Resource):
    @check_jwt(editor=True)
    def get(self, CID, SID, QID):
        item_question = dbc.get.question(CID, SID, QID)
        return item_response(schema.dump(item_question))

    @check_jwt(editor=True)
    def put(self, CID, SID, QID):
        args = question_parser.parse_args(strict=True)

        item_question = dbc.get.question(CID, SID, QID)
        item_question = dbc.edit.question(item_question, **args)

        return item_response(schema.dump(item_question))

    @check_jwt(editor=True)
    def delete(self, CID, SID, QID):
        item_question = dbc.get.question(CID, SID, QID)
        dbc.delete.question(item_question)
        return {}, codes.NO_CONTENT
