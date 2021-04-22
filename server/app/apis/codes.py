import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core import http_codes as codes
from app.core.dto import CodeDTO
from app.core.parsers import code_parser
from app.database.models import Code, Competition
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = CodeDTO.api
schema = CodeDTO.schema
list_schema = CodeDTO.list_schema


@api.route("/")
@api.param("competition_id")
class CodesList(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id):
        items = dbc.get.code_list(competition_id)
        return list_response(list_schema.dump(items), len(items)), codes.OK


@api.route("/<code_id>")
@api.param("competition_id, code_id")
class CodesById(Resource):
    @check_jwt(editor=False)
    def put(self, competition_id, code_id):
        item = dbc.get.one(Code, code_id)
        item.code = dbc.utils.generate_unique_code()
        dbc.utils.commit_and_refresh(item)
        return item_response(schema.dump(item)), codes.OK
