import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import ComponentDTO
from app.core.parsers import component_create_parser, component_parser
from app.database.models import Competition, Component
from flask.globals import request
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = ComponentDTO.api
schema = ComponentDTO.schema
list_schema = ComponentDTO.list_schema


@api.route("/<component_id>")
@api.param("competition_id, slide_id, component_id")
class ComponentByID(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, slide_id, component_id):
        item = dbc.get.component(competition_id, slide_id, component_id)
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def put(self, competition_id, slide_id, component_id):
        args = component_parser.parse_args()
        item = dbc.get.component(competition_id, slide_id, component_id)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def delete(self, competition_id, slide_id, component_id):
        item = dbc.get.component(competition_id, slide_id, component_id)
        dbc.delete.component(item)
        return {}, codes.NO_CONTENT


@api.route("/")
@api.param("competition_id, slide_id")
class ComponentList(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, slide_id):
        items = dbc.get.component_list(competition_id, slide_id)
        return list_response(list_schema.dump(items))

    @check_jwt(editor=True)
    def post(self, competition_id, slide_id):
        args = component_create_parser.parse_args()
        item = dbc.add.component(slide_id=slide_id, **args)
        return item_response(schema.dump(item))
