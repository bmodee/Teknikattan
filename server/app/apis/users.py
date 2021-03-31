import app.core.controller as dbc
import app.core.utils.http_codes as codes
from app.apis import admin_required
from app.core.dto import UserDTO
from app.core.models import User
from app.core.parsers import user_parser, user_search_parser
from app.core.schemas import user_schema
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

api = UserDTO.api
user_model = UserDTO.model


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
    @api.marshal_list_with(user_model)
    def get(self):
        return User.query.filter(User.id == get_jwt_identity()).first()

    @jwt_required
    @api.marshal_with(user_model)
    def put(self):
        args = user_parser.parse_args(strict=True)
        item_user = User.query.filter(User.id == get_jwt_identity()).first()
        return edit_user(item_user, args)


@api.route("/<ID>")
@api.param("ID")
class Users(Resource):
    @jwt_required
    @api.marshal_with(user_model)
    def get(self, ID):
        return User.query.filter(User.id == ID).first()

    @jwt_required
    @api.marshal_with(user_model)
    def put(self, ID):
        args = user_parser.parse_args(strict=True)
        item_user = User.query.filter(User.id == ID).first()
        return edit_user(item_user, args)


@api.route("/search")
class UserSearch(Resource):
    @jwt_required
    @api.marshal_list_with(user_model)
    def get(self):
        args = user_search_parser.parse_args(strict=True)
        name = args.get("name")
        email = args.get("email")
        role_id = args.get("role_id")
        city_id = args.get("city_id")
        page = args.get("page", 1)
        page_size = args.get("page_size", 15)

        return dbc.get.search_user(email, name, city_id, role_id, page, page_size)
