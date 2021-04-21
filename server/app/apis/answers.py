import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import QuestionAnswerDTO
from app.core.parsers import question_answer_edit_parser, question_answer_parser
from app.core.schemas import QuestionAlternativeSchema
from app.database.controller.add import question_alternative
from app.database.controller.get import question_alternatives
from app.database.models import Question, QuestionAlternative, QuestionAnswer
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = QuestionAnswerDTO.api
schema = QuestionAnswerDTO.schema
list_schema = QuestionAnswerDTO.list_schema


@api.route("/")
@api.param("CID, TID")
class QuestionAnswerList(Resource):
    @check_jwt(editor=True)
    def get(self, CID, TID):
        items = dbc.get.question_answers(TID)
        return list_response(list_schema.dump(items))

    @check_jwt(editor=True)
    def post(self, CID, TID):
        args = question_answer_parser.parse_args(strict=True)
        item = dbc.add.question_answer(**args, team_id=TID)
        return item_response(schema.dump(item))


@api.route("/<AID>")
@api.param("CID, TID, AID")
class QuestionAnswers(Resource):
    @check_jwt(editor=True)
    def put(self, CID, TID, AID):
        args = question_answer_edit_parser.parse_args(strict=True)
        item = dbc.get.one(QuestionAnswer, AID)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))
