import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, list_response
from app.core.dto import UserDTO
from app.core.models import User
from app.core.parsers import user_parser, user_search_parser
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

api = UserDTO.api
schema = UserDTO.schema
list_schema = UserDTO.list_schema


def edit_user(item_user, args):
    email = args.get("email")
    name = args.get("name")
    city_id = args.get("city_id")
    role_id = args.get("role_id")

    if email:
        if User.query.filter(User.email == args["email"]).count() > 0:
            api.abort(codes.BAD_REQUEST, "Email is already in use")

    return dbc.edit.user(item_user, name, email, city_id, role_id)


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
        name = args.get("name")
        email = args.get("email")
        role_id = args.get("role_id")
        city_id = args.get("city_id")
        page = args.get("page", 0)
        page_size = args.get("page_size", 15)
        order = args.get("order", 1)
        order_by = args.get("order_by")

        items, total = dbc.get.search_user(email, name, city_id, role_id, page, page_size, order, order_by)
        return list_response(list_schema.dump(items), total)
