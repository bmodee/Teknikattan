"""
All API calls concerning question alternatives.
Default route: /api/users
"""


import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, UserSchema
from app.database import models
from app.database.models import User, Whitelist
from flask.views import MethodView
from flask_jwt_extended.utils import get_jwt_identity
from flask_smorest import abort
from flask_smorest.error_handler import ErrorSchema
from marshmallow import fields

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "users", "users", url_prefix="/api/users", description="Adding, updating, deleting and searching for users"
)


class UserAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.User

    name = ma.auto_field()
    password = fields.String(required=True)
    email = ma.auto_field(required=True)
    role_id = ma.auto_field(required=True)
    city_id = ma.auto_field(required=True)


class UserEditArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.User

    name = ma.auto_field(required=False)
    email = ma.auto_field(required=False)
    role_id = ma.auto_field(required=False)
    city_id = ma.auto_field(required=False)


class UserSearchArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.User

    name = ma.auto_field(required=False)
    email = ma.auto_field(required=False)
    role_id = ma.auto_field(required=False)
    city_id = ma.auto_field(required=False)


@blp.route("")
class Users(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, UserSchema)
    def get(self):
        """ Get currently logged in user. """
        return dbc.get.one(User, get_jwt_identity())

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(UserEditArgsSchema)
    @blp.response(http_codes.OK, UserSchema)
    def put(self, args):
        """ Edit current user. """
        return _edit_user(dbc.get.one(User, get_jwt_identity()), args)

    @blp.authorization(allowed_roles=["Admin"])
    @blp.arguments(UserAddArgsSchema)
    @blp.response(http_codes.OK, UserSchema)
    def post(self, args):
        """ Creates a new user if the user does not already exist. """
        return dbc.add.user(**args)


@blp.route("/<user_id>")
class UsersById(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, UserSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="User not found")
    def get(self, user_id):
        """ Get user with <user_id> """
        return dbc.get.one(User, user_id)

    @blp.authorization(allowed_roles=["Admin"])
    @blp.arguments(UserEditArgsSchema)
    @blp.response(http_codes.OK, UserSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="User not found")
    @blp.alt_response(
        http_codes.CONFLICT, ErrorSchema, description="The user can't be updated with the provided values"
    )
    def put(self, args, user_id):
        """ Edits user with <user_id> """
        return _edit_user(dbc.get.one(User, user_id), args)

    @blp.authorization(allowed_roles=["Admin"])
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="User not found")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="The user can't be deleted")
    def delete(self, user_id):
        """ Deletes the specified user and adds their token to the blacklist. """
        item_user = dbc.get.one(User, user_id)
        dbc.delete.whitelist_to_blacklist(Whitelist.user_id == user_id)  # Blacklist all the whitelisted tokens
        dbc.delete.default(item_user)
        return None


@blp.route("/search")
class UserSearch(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(UserSearchArgsSchema, location="query")
    @blp.paginate()
    @blp.response(http_codes.OK, UserSchema(many=True))
    def get(self, args, pagination_parameters):
        """ Finds a specific user based on the provided arguments. """
        return dbc.search.user(pagination_parameters, **args)


def _edit_user(item_user, args):
    """ Edits a user using the provided arguments. """

    email = args.get("email")
    name = args.get("name")

    if email and dbc.get.user_exists(email):
        abort(http_codes.CONFLICT, message="En användare med den mejladressen finns redan")
    if name:
        args["name"] = args["name"].title()

    return dbc.edit.default(item_user, **args)
