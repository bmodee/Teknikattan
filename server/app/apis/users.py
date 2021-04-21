import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import UserDTO
from app.core.parsers import user_parser, user_search_parser
from app.database.models import User
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

api = UserDTO.api
schema = UserDTO.schema
list_schema = UserDTO.list_schema


def edit_user(item_user, args):
    email = args.get("email")
    if email:
        if User.query.filter(User.email == args["email"]).count() > 0:
            api.abort(codes.BAD_REQUEST, "Email is already in use")

    try:
        args["name"] = args.get("name").title()
    except Exception:
        pass

    return dbc.edit.default(item_user, **args)


@api.route("/")
class UsersList(Resource):
    @check_jwt(editor=True)
    def get(self):
        item = dbc.get.user(get_jwt_identity())
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def put(self):
        args = user_parser.parse_args(strict=True)
        item = dbc.get.user(get_jwt_identity())
        item = edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/<ID>")
@api.param("ID")
class Users(Resource):
    @check_jwt(editor=True)
    def get(self, ID):
        item = dbc.get.user(ID)
        return item_response(schema.dump(item))

    @check_jwt(editor=False)
    def put(self, ID):
        args = user_parser.parse_args(strict=True)
        item = dbc.get.user(ID)
        item = edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/search")
class UserSearch(Resource):
    @check_jwt(editor=True)
    def get(self):
        args = user_search_parser.parse_args(strict=True)
        items, total = dbc.search.user(**args)
        return list_response(list_schema.dump(items), total)
