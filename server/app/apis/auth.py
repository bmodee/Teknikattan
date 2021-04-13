import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import admin_required, item_response, text_response
from app.core.dto import AuthDTO
from app.core.parsers import create_user_parser, login_parser
from app.database.models import User
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_raw_jwt,
    jwt_refresh_token_required,
    jwt_required,
)
from flask_restx import Namespace, Resource, cors

api = AuthDTO.api
schema = AuthDTO.schema
list_schema = AuthDTO.list_schema


def get_user_claims(item_user):
    return {"role": item_user.role.name, "city": item_user.city.name}


@api.route("/signup")
class AuthSignup(Resource):
    @jwt_required
    def post(self):
        args = create_user_parser.parse_args(strict=True)
        email = args.get("email")

        if dbc.get.user_exists(email):
            api.abort(codes.BAD_REQUEST, "User already exists")

        item_user = dbc.add.user(**args)
        return item_response(schema.dump(item_user))


@api.route("/delete/<ID>")
@api.param("ID")
class AuthDelete(Resource):
    @jwt_required
    def delete(self, ID):
        item_user = dbc.get.user(ID)

        dbc.delete.default(item_user)
        if int(ID) == get_jwt_identity():
            jti = get_raw_jwt()["jti"]
            dbc.add.blacklist(jti)
        return text_response(f"User {ID} deleted")


@api.route("/login")
class AuthLogin(Resource):
    def post(self):
        args = login_parser.parse_args(strict=True)
        email = args.get("email")
        password = args.get("password")
        item_user = dbc.get.user_by_email(email, required=False)

        if not item_user or not item_user.is_correct_password(password):
            api.abort(codes.UNAUTHORIZED, "Invalid email or password")

        access_token = create_access_token(item_user.id, user_claims=get_user_claims(item_user))
        refresh_token = create_refresh_token(item_user.id)

        response = {"id": item_user.id, "access_token": access_token, "refresh_token": refresh_token}
        return response


@api.route("/logout")
class AuthLogout(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        dbc.add.blacklist(jti)
        return text_response("User logout")


@api.route("/refresh")
class AuthRefresh(Resource):
    @jwt_required
    @jwt_refresh_token_required
    def post(self):
        old_jti = get_raw_jwt()["jti"]

        item_user = dbc.get.user(get_jwt_identity())
        access_token = create_access_token(item_user.id, user_claims=get_user_claims(item_user))
        dbc.add.blacklist(old_jti)
        response = {"access_token": access_token}
        return response
