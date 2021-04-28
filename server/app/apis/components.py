import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import ComponentDTO
from flask_restx import Resource
from flask_restx import reqparse

api = ComponentDTO.api
schema = ComponentDTO.schema
list_schema = ComponentDTO.list_schema


component_parser = reqparse.RequestParser()
component_parser.add_argument("x", type=str, default=None, location="json")
component_parser.add_argument("y", type=int, default=None, location="json")
component_parser.add_argument("w", type=int, default=None, location="json")
component_parser.add_argument("h", type=int, default=None, location="json")

component_edit_parser = component_parser.copy()
component_edit_parser.add_argument("text", type=str, location="json")
component_edit_parser.add_argument("media_id", type=str, location="json")

component_create_parser = component_edit_parser.copy()
component_create_parser.add_argument("type_id", type=int, required=True, location="json")
component_create_parser.add_argument("view_type_id", type=int, required=True, location="json")


@api.route("/<component_id>")
@api.param("competition_id, slide_id, component_id")
class ComponentByID(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, component_id):
        item = dbc.get.component(competition_id, slide_id, component_id)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, slide_id, component_id):
        args = component_edit_parser.parse_args(strict=True)
        item = dbc.get.component(competition_id, slide_id, component_id)
        args_without_none = {key: value for key, value in args.items() if value is not None}
        item = dbc.edit.default(item, **args_without_none)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id, component_id):
        item = dbc.get.component(competition_id, slide_id, component_id)
        dbc.delete.component(item)
        return {}, codes.NO_CONTENT


@api.route("")
@api.param("competition_id, slide_id")
class ComponentList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id):
        items = dbc.get.component_list(competition_id, slide_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id):
        args = component_create_parser.parse_args()
        item = dbc.add.component(slide_id=slide_id, **args)
        return item_response(schema.dump(item))
