import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, list_response
from app.core.controller.add import competition
from app.core.dto import QuestionDTO
from app.core.models import Question
from app.core.parsers import question_parser
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

api = QuestionDTO.api
schema = QuestionDTO.schema
list_schema = QuestionDTO.list_schema


@api.route("/")
@api.param("CID")
class QuestionsList(Resource):
    @jwt_required
    def get(self, CID):
        items, total = dbc.get.search_questions(competition_id=CID)
        return list_response(list_schema.dump(items), total)

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
        item_question = Question.query.filter(Question.id == QID).first()

        if item_question is None:
            api.abort(codes.NOT_FOUND, f"Could not find question with id {QID}.")

        if item_question.slide.competition.id != int(CID):
            api.abort(codes.NOT_FOUND, f"Could not find question with id {QID} in competition with id {CID}.")

        return item_response(schema.dump(item_question))

    @jwt_required
    def put(self, CID, QID):
        args = question_parser.parse_args(strict=True)
        print(f"questions 54: {args=}")

        item_question = Question.query.filter(Question.id == QID).first()
        if item_question.slide.competition.id != int(CID):
            api.abort(codes.NOT_FOUND, f"Could not find question with id {QID} in competition with id {CID}.")

        item_question = dbc.edit.question(item_question, **args)

        return item_response(schema.dump(item_question))

    @jwt_required
    def delete(self, CID, QID):
        item_question = dbc.get.question(CID, QID)
        if not item_question:
            return {"response": "No content found"}, codes.NOT_FOUND

        dbc.delete.question(item_question)
        return {}, codes.NO_CONTENT
