import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, list_response
from app.core.dto import UserDTO
from app.core.models import User
from app.core.parsers import user_parser, user_search_parser
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

    return dbc.edit.user(item_user, **args)


@api.route("/")
class UsersList(Resource):
    @jwt_required
    def get(self):
        item = User.query.filter(User.id == get_jwt_identity()).first()
        return item_response(schema.dump(item))

    @jwt_required
    def put(self):
        args = user_parser.parse_args(strict=True)
        item = User.query.filter(User.id == get_jwt_identity()).first()
        item = edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/<ID>")
@api.param("ID")
class Users(Resource):
    @jwt_required
    def get(self, ID):
        item = User.query.filter(User.id == ID).first()
        return item_response(schema.dump(item))

    @jwt_required
    def put(self, ID):
        args = user_parser.parse_args(strict=True)
        item = User.query.filter(User.id == ID).first()
        item = edit_user(item, args)
        return item_response(schema.dump(item))


@api.route("/search")
class UserSearch(Resource):
    @jwt_required
    def get(self):
        args = user_search_parser.parse_args(strict=True)
        items, total = dbc.get.search_user(**args)
        return list_response(list_schema.dump(items), total)
