import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import UserDTO
from flask_jwt_extended import get_jwt_identity
from flask_restx import Resource
from flask_restx import inputs, reqparse
from app.core.parsers import search_parser

api = UserDTO.api
schema = UserDTO.schema
list_schema = UserDTO.list_schema

user_parser = reqparse.RequestParser()
user_parser.add_argument("email", type=inputs.email(), location="json")
user_parser.add_argument("name", type=str, location="json")
user_parser.add_argument("city_id", type=int, location="json")
user_parser.add_argument("role_id", type=int, location="json")

user_search_parser = search_parser.copy()
user_search_parser.add_argument("name", type=str, default=None, location="args")
user_search_parser.add_argument("email", type=str, default=None, location="args")
user_search_parser.add_argument("city_id", type=int, default=None, location="args")
user_search_parser.add_argument("role_id", type=int, default=None, location="args")


def _edit_user(item_user, args):
    email = args.get("email")
    name = args.get("name")

    if email:
        if dbc.get.user_exists(email):
            api.abort(codes.BAD_REQUEST, "Email is already in use")

    if name:
        args["name"] = args["name"].title()

    return dbc.edit.default(item_user, **args)


@api.route("")
class UsersList(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self):
        item = dbc.get.user(get_jwt_identity())
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def put(self):
        args = user_parser.parse_args(strict=True)
        item = dbc.get.user(get_jwt_identity())
        item = _edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/<ID>")
@api.param("ID")
class Users(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, ID):
        item = dbc.get.user(ID)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["Admin"])
    def put(self, ID):
        args = user_parser.parse_args(strict=True)
        item = dbc.get.user(ID)
        item = _edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/search")
class UserSearch(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self):
        args = user_search_parser.parse_args(strict=True)
        items, total = dbc.search.user(**args)
        return list_response(list_schema.dump(items), total)
