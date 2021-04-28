import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, protect_route, text_response
from app.core.codes import verify_code
from app.core.dto import AuthDTO, CodeDTO
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_raw_jwt,
    jwt_refresh_token_required,
)
from flask_restx import Resource
from flask_restx import inputs, reqparse
from datetime import timedelta
from app.core import sockets

api = AuthDTO.api
schema = AuthDTO.schema
list_schema = AuthDTO.list_schema

login_parser = reqparse.RequestParser()
login_parser.add_argument("email", type=inputs.email(), required=True, location="json")
login_parser.add_argument("password", required=True, location="json")

create_user_parser = login_parser.copy()
create_user_parser.add_argument("city_id", type=int, required=True, location="json")
create_user_parser.add_argument("role_id", type=int, required=True, location="json")

login_code_parser = reqparse.RequestParser()
login_code_parser.add_argument("code", type=str, location="json")


def get_user_claims(item_user):
    return {"role": item_user.role.name, "city_id": item_user.city_id}


def get_code_claims(item_code):
    return {"view": item_code.view_type.name, "competition_id": item_code.competition_id, "team_id": item_code.team_id}


@api.route("/signup")
class AuthSignup(Resource):
    @protect_route(allowed_roles=["Admin"])
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
    @protect_route(allowed_roles=["Admin"])
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
        item_user = dbc.get.user_by_email(email)

        if not item_user or not item_user.is_correct_password(password):
            api.abort(codes.UNAUTHORIZED, "Invalid email or password")

        access_token = create_access_token(item_user.id, user_claims=get_user_claims(item_user))
        refresh_token = create_refresh_token(item_user.id)

        response = {"id": item_user.id, "access_token": access_token, "refresh_token": refresh_token}
        return response


@api.route("/login/code")
class AuthLoginCode(Resource):
    def post(self):
        args = login_code_parser.parse_args()
        code = args["code"]

        if not verify_code(code):
            api.abort(codes.UNAUTHORIZED, "Invalid code")

        item_code = dbc.get.code_by_code(code)

        if item_code.competition_id not in sockets.presentations:
            api.abort(codes.UNAUTHORIZED, "Competition not active")

        access_token = create_access_token(
            item_code.id, user_claims=get_code_claims(item_code), expires_delta=timedelta(hours=8)
        )

        response = {
            "competition_id": item_code.competition_id,
            "view_type_id": item_code.view_type_id,
            "team_id": item_code.team_id,
            "access_token": access_token,
        }
        return response


@api.route("/logout")
class AuthLogout(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def post(self):
        jti = get_raw_jwt()["jti"]
        dbc.add.blacklist(jti)
        return text_response("Logout")


@api.route("/refresh")
class AuthRefresh(Resource):
    @protect_route(allowed_roles=["*"])
    @jwt_refresh_token_required
    def post(self):
        old_jti = get_raw_jwt()["jti"]

        item_user = dbc.get.user(get_jwt_identity())
        access_token = create_access_token(item_user.id, user_claims=get_user_claims(item_user))
        dbc.add.blacklist(old_jti)
        response = {"access_token": access_token}
        return response
