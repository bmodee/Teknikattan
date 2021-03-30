import app.core.controller as dbc
import app.core.utils.http_codes as codes
from app.apis import admin_required
from app.core.models import User
from app.core.parsers import user_parser, user_search_parser
from app.core.schemas import user_schema
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

api = Namespace("users")
user_model = api.model(*user_schema)


def edit_user(item_user, args):
    email = args.get("email")
    name = args.get("name")
    city = args.get("city")
    role = args.get("role")

    if email:
        if User.query.filter(User.email == args["email"]).count() > 0:
            api.abort(codes.BAD_REQUEST, "Email is already in use")

    return dbc.edit.user(item_user, name, email, city, role)


@api.route("/")
class UserBase(Resource):
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
class UserByID(Resource):
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
        role = args.get("role")
        city = args.get("city")
        page = args.get("page", 1)
        page_size = args.get("page_size", 15)

        return dbc.get.search_user(email, name, city, role, page, page_size)
