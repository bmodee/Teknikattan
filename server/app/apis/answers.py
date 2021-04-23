import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import QuestionAnswerDTO
from app.core.parsers import question_answer_edit_parser, question_answer_parser
from app.core.schemas import QuestionAlternativeSchema
from app.database.models import Question, QuestionAlternative, QuestionAnswer
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = QuestionAnswerDTO.api
schema = QuestionAnswerDTO.schema
list_schema = QuestionAnswerDTO.list_schema


@api.route("")
@api.param("competition_id, team_id")
class QuestionAnswerList(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, team_id):
        items = dbc.get.question_answer_list(competition_id, team_id)
        return list_response(list_schema.dump(items))

    @check_jwt(editor=True)
    def post(self, competition_id, team_id):
        args = question_answer_parser.parse_args(strict=True)
        item = dbc.add.question_answer(**args, team_id=team_id)
        return item_response(schema.dump(item))


@api.route("/<answer_id>")
@api.param("competition_id, team_id, answer_id")
class QuestionAnswers(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, team_id, answer_id):
        item = dbc.get.question_answer(competition_id, team_id, answer_id)
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def put(self, competition_id, team_id, answer_id):
        args = question_answer_edit_parser.parse_args(strict=True)
        item = dbc.get.question_answer(competition_id, team_id, answer_id)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))
