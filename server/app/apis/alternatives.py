import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import QuestionAlternativeDTO, QuestionDTO
from app.core.parsers import question_alternative_parser
from app.core.schemas import QuestionAlternativeSchema
from app.database.controller.add import question_alternative
from app.database.controller.get import question_alternatives
from app.database.models import Question, QuestionAlternative
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = QuestionAlternativeDTO.api
schema = QuestionAlternativeDTO.schema
list_schema = QuestionAlternativeDTO.list_schema


@api.route("/")
@api.param("CID, SOrder, QID")
class QuestionAlternativeList(Resource):
    @check_jwt(editor=True)
    def get(self, CID, SOrder, QID):
        items = dbc.get.question_alternatives(QID)
        return list_response(list_schema.dump(items))

    @check_jwt(editor=True)
    def post(self, CID, SOrder, QID):
        args = question_alternative_parser.parse_args(strict=True)
        item = dbc.add.question_alternative(**args, question_id=QID)
        return item_response(schema.dump(item))


@api.route("/<AID>")
@api.param("CID, SOrder, QID, AID")
class QuestionAlternatives(Resource):
    @check_jwt(editor=True)
    def put(self, CID, SOrder, QID, AID):
        args = question_alternative_parser.parse_args(strict=True)
        item = dbc.get.one(QuestionAlternative, AID)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def delete(self, CID, SOrder, QID, AID):
        item = dbc.get.one(QuestionAlternative, AID)
        dbc.delete.default(item)
        return {}, codes.NO_CONTENT
