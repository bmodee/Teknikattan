import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, text_response
from app.core.dto import AuthDTO
from app.core.models import User
from app.core.parsers import create_user_parser, login_parser
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
        password = args.get("password")
        role_id = args.get("role_id")
        city_id = args.get("city_id")

        if User.query.filter(User.email == email).count() > 0:
            api.abort(codes.BAD_REQUEST, "User already exists")

        item_user = dbc.add.default(User(email, password, role_id, city_id))
        if not item_user:
            api.abort(codes.BAD_REQUEST, "User could not be created")

        return item_response(schema.dump(item_user))


@api.route("/delete/<ID>")
@api.param("ID")
class AuthDelete(Resource):
    @jwt_required
    def delete(self, ID):
        item_user = User.query.filter(User.id == ID).first()
        dbc.delete.default(item_user)
        if ID == get_jwt_identity():
            jti = get_raw_jwt()["jti"]
            dbc.add.blacklist(jti)
        return text_response(f"User {ID} deleted")


@api.route("/login")
class AuthLogin(Resource):
    def post(self):
        args = login_parser.parse_args(strict=True)
        email = args.get("email")
        password = args.get("password")
        item_user = User.query.filter_by(email=email).first()

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

        item_user = User.query.filter_by(id=get_jwt_identity()).first()
        access_token = create_access_token(item_user.id, user_claims=get_user_claims(item_user))
        dbc.add.blacklist(old_jti)
        response = {"access_token": access_token}
        return response
