"""
All API calls concerning question answers.
Default route: /api/auth
"""

from datetime import datetime, timedelta

import app.database.controller as dbc
import marshmallow as ma
from app.core.codes import verify_code
from app.core.sockets import is_active_competition
from app.database.controller.delete import whitelist_to_blacklist
from app.database.models import Whitelist
from flask import current_app, has_app_context
from flask.views import MethodView
from flask_jwt_extended import create_access_token, get_jti
from flask_jwt_extended.utils import get_jti, get_jwt
from flask_smorest import abort
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "auth", "auth", url_prefix="/api/auth", description="Logging in as a user or with a code, and logging out"
)


class UserLoginArgsSchema(ma.Schema):
    email = ma.fields.Email(required=True)
    password = ma.fields.String(required=True)


class UserLoginResponseSchema(ma.Schema):
    id = ma.fields.Int()
    access_token = ma.fields.String()


if has_app_context():
    USER_LOGIN_LOCKED_ATTEMPTS = current_app.config["USER_LOGIN_LOCKED_ATTEMPTS"]
    USER_LOGIN_LOCKED_EXPIRES = current_app.config["USER_LOGIN_LOCKED_EXPIRES"]


def get_user_claims(item_user):
    """ Gets user details for jwt. """

    return {"role": item_user.role.name, "city_id": item_user.city_id}


def get_code_claims(item_code):
    """ Gets code details for jwt. """

    return {
        "view": item_code.view_type.name,
        "competition_id": item_code.competition_id,
        "team_id": item_code.team_id,
        "code": item_code.code,
    }


@blp.route("/test")
class AuthSignup(MethodView):
    @blp.authorization(allowed_roles=["Admin"], allowed_views=["*"])
    @blp.response(http_codes.NO_CONTENT, None)
    def get(self):
        """ Tests that the user is admin or is in a competition. """
        return None


@blp.route("/login")
class AuthLogin(MethodView):
    @blp.arguments(UserLoginArgsSchema)
    @blp.response(http_codes.OK, UserLoginResponseSchema)
    def post(self, args):
        """ Logs in the specified user and creates a jwt. """

        email = args.get("email")
        password = args.get("password")
        item_user = dbc.get.user_by_email(email)

        # Login with unknown email
        if not item_user:
            abort(http_codes.UNAUTHORIZED, "Ogiltigt användarnamn eller lösenord")

        now = datetime.now()

        # Login with existing email but with wrong password
        if not item_user.is_correct_password(password):
            # Increase the login attempts every time the user tries to login with wrong password
            item_user.login_attempts += 1

            # Lock the user out for some time
            if item_user.login_attempts >= USER_LOGIN_LOCKED_ATTEMPTS:
                item_user.locked = now + USER_LOGIN_LOCKED_EXPIRES

            dbc.utils.commit()
            abort(http_codes.UNAUTHORIZED, "Ogiltigt användarnamn eller lösenord")

        # Otherwise if login was successful but the user is locked
        if item_user.locked:
            # Check if locked is greater than now
            if item_user.locked.timestamp() > now.timestamp():
                abort(http_codes.UNAUTHORIZED, f"Kontot låst, försök igen om {item_user.locked} timmar")
            else:
                item_user.locked = None

        # If everything else was successful, set login_attempts to 0
        item_user.login_attempts = 0
        dbc.utils.commit()

        # Create the jwt with user.id as the identifier
        access_token = create_access_token(item_user.id, additional_claims=get_user_claims(item_user))

        # Whitelist the created jwt
        dbc.add.whitelist(get_jti(access_token), item_user.id)

        # Login response includes the id and jwt for the user
        return {"id": item_user.id, "access_token": access_token}


@blp.route("/logout")
class AuthLogout(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    def post(self):
        """ Logs out. """
        whitelist_to_blacklist(Whitelist.jti == get_jwt()["jti"])
        return None


class CodeArgsSchema(ma.Schema):
    code = ma.fields.String(required=True)


class CodeResponseSchema(ma.Schema):
    competition_id = ma.fields.Int()
    view = ma.fields.String()
    team_id = ma.fields.Int()
    access_token = ma.fields.String()


@blp.route("/code")
class AuthLoginCode(MethodView):
    @blp.arguments(CodeArgsSchema)
    @blp.response(http_codes.OK, CodeResponseSchema)
    @blp.alt_response(http_codes.UNAUTHORIZED, ErrorSchema, description="Incorrect code or competition is not active")
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="The code doesn't exist")
    def post(self, args):
        """ Logs in using the provided competition code. """

        code = args["code"]

        if not verify_code(code):  # Check that code string is valid
            abort(http_codes.UNAUTHORIZED, message="Felaktigt kod")

        item_code = dbc.get.code_by_code(code)

        # If joining client is not operator and competition is not active
        if item_code.view_type_id != 4 and not is_active_competition(item_code.competition_id):
            abort(http_codes.UNAUTHORIZED, message="Tävlingen är ej aktiv")

        # Create jwt that is only valid for 8 hours
        access_token = create_access_token(
            item_code.id, additional_claims=get_code_claims(item_code), expires_delta=timedelta(hours=8)
        )
        dbc.add.whitelist(get_jti(access_token), competition_id=item_code.competition_id)  # Whitelist the created jwt

        return {
            "competition_id": item_code.competition_id,
            "view": item_code.view_type.name,
            "team_id": item_code.team_id,
            "access_token": access_token,
        }
