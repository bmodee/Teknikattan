"""
All API calls concerning question alternatives.
Default route: /api/users
"""

import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import UserDTO
from app.core.parsers import search_parser, sentinel
from app.database.models import User
from flask_jwt_extended import get_jwt_identity
from flask_restx import Resource, inputs, reqparse

api = UserDTO.api
schema = UserDTO.schema
list_schema = UserDTO.list_schema

user_parser_edit = reqparse.RequestParser()
user_parser_edit.add_argument("email", type=inputs.email(), default=sentinel, location="json")
user_parser_edit.add_argument("name", type=str, default=sentinel, location="json")
user_parser_edit.add_argument("city_id", type=int, default=sentinel, location="json")
user_parser_edit.add_argument("role_id", type=int, default=sentinel, location="json")

user_search_parser = search_parser.copy()
user_search_parser.add_argument("name", type=str, default=sentinel, location="args")
user_search_parser.add_argument("email", type=str, default=sentinel, location="args")
user_search_parser.add_argument("city_id", type=int, default=sentinel, location="args")
user_search_parser.add_argument("role_id", type=int, default=sentinel, location="args")


def _edit_user(item_user, args):
    """ Edits a user using the provided arguments. """

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
        """ Gets all users. """

        item = dbc.get.one(User, get_jwt_identity())
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def put(self):
        """ Posts a new user using the specified arguments. """

        args = user_parser_edit.parse_args(strict=True)
        item = dbc.get.one(User, get_jwt_identity())
        item = _edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/<ID>")
@api.param("ID")
class Users(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, ID):
        """ Gets the specified user. """

        item = dbc.get.one(User, ID)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["Admin"])
    def put(self, ID):
        """ Edits the specified team using the provided arguments. """

        args = user_parser_edit.parse_args(strict=True)
        item = dbc.get.one(User, ID)
        item = _edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/search")
class UserSearch(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self):
        """ Finds a specific user based on the provided arguments. """

        args = user_search_parser.parse_args(strict=True)
        items, total = dbc.search.user(**args)
        return list_response(list_schema.dump(items), total)
