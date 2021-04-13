import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import QuestionDTO
from app.core.parsers import question_parser
from app.database.models import Question
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = QuestionDTO.api
schema = QuestionDTO.schema
list_schema = QuestionDTO.list_schema


@api.route("/")
@api.param("CID")
class QuestionsList(Resource):
    @jwt_required
    def get(self, CID):
        items = dbc.get.question_list(CID)
        return list_response(list_schema.dump(items))

    @jwt_required
    def post(self, CID):
        args = question_parser.parse_args(strict=True)

        name = args.get("name")
        total_score = args.get("total_score")
        type_id = args.get("type_id")
        slide_id = args.get("slide_id")

        item_slide = dbc.get.slide(CID, slide_id)
        item = dbc.add.question(name, total_score, type_id, item_slide)

        return item_response(schema.dump(item))


@api.route("/<QID>")
@api.param("CID,QID")
class Questions(Resource):
    @jwt_required
    def get(self, CID, QID):
        item_question = dbc.get.question(CID, QID)
        return item_response(schema.dump(item_question))

    @jwt_required
    def put(self, CID, QID):
        args = question_parser.parse_args(strict=True)

        item_question = dbc.get.question(CID, QID)
        item_question = dbc.edit.question(item_question, **args)

        return item_response(schema.dump(item_question))

    @jwt_required
    def delete(self, CID, QID):
        item_question = dbc.get.question(CID, QID)
        dbc.delete.question(item_question)
        return {}, codes.NO_CONTENT
