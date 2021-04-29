import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import CodeDTO
from app.database.models import Code
from flask_restx import Resource

api = CodeDTO.api
schema = CodeDTO.schema
list_schema = CodeDTO.list_schema


@api.route("")
@api.param("competition_id")
class CodesList(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id):
        items = dbc.get.code_list(competition_id)
        return list_response(list_schema.dump(items), len(items))


@api.route("/<code_id>")
@api.param("competition_id, code_id")
class CodesById(Resource):
    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, code_id):
        item = dbc.get.one(Code, code_id)
        item.code = dbc.utils.generate_unique_code()
        dbc.utils.commit_and_refresh(item)
        return item_response(schema.dump(item))
