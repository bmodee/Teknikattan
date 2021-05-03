import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import ComponentDTO
from flask_restx import Resource
from flask_restx import reqparse
from app.core.parsers import sentinel

api = ComponentDTO.api
schema = ComponentDTO.schema
list_schema = ComponentDTO.list_schema

component_parser_add = reqparse.RequestParser()
component_parser_add.add_argument("x", type=int, default=0, location="json")
component_parser_add.add_argument("y", type=int, default=0, location="json")
component_parser_add.add_argument("w", type=int, default=1, location="json")
component_parser_add.add_argument("h", type=int, default=1, location="json")
component_parser_add.add_argument("type_id", type=int, required=True, location="json")
component_parser_add.add_argument("view_type_id", type=int, required=True, location="json")
component_parser_add.add_argument("text", type=str, default=None, location="json")
component_parser_add.add_argument("media_id", type=int, default=None, location="json")
component_parser_add.add_argument("question_id", type=int, default=None, location="json")

component_parser_edit = reqparse.RequestParser()
component_parser_edit.add_argument("x", type=int, default=sentinel, location="json")
component_parser_edit.add_argument("y", type=int, default=sentinel, location="json")
component_parser_edit.add_argument("w", type=int, default=sentinel, location="json")
component_parser_edit.add_argument("h", type=int, default=sentinel, location="json")
component_parser_edit.add_argument("text", type=str, default=sentinel, location="json")
component_parser_edit.add_argument("media_id", type=int, default=sentinel, location="json")
component_parser_edit.add_argument("question_id", type=int, default=sentinel, location="json")


@api.route("/<component_id>")
@api.param("competition_id, slide_id, component_id")
class ComponentByID(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, component_id):
        item = dbc.get.component(competition_id, slide_id, component_id)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, slide_id, component_id):
        args = component_parser_edit.parse_args(strict=True)
        item = dbc.get.component(competition_id, slide_id, component_id)
        args_without_sentinel = {key: value for key, value in args.items() if value is not sentinel}
        item = dbc.edit.default(item, **args_without_sentinel)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id, component_id):
        item = dbc.get.component(competition_id, slide_id, component_id)
        dbc.delete.component(item)
        return {}, codes.NO_CONTENT


@api.route("/<component_id>/copy/<view_type_id>")
@api.param("competition_id, slide_id, component_id, view_type_id")
class ComponentList(Resource):
    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id, component_id, view_type_id):
        item_component = dbc.get.component(competition_id, slide_id, component_id)
        item = dbc.copy.component(item_component, slide_id, view_type_id)
        return item_response(schema.dump(item))


@api.route("")
@api.param("competition_id, slide_id")
class ComponentList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id):
        items = dbc.get.component_list(competition_id, slide_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id):
        args = component_parser_add.parse_args()
        item = dbc.add.component(slide_id=slide_id, **args)
        return item_response(schema.dump(item))
