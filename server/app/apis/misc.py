"""
All misc API calls.
Default route: /api/misc
"""

import app.database.controller as dbc
import marshmallow as ma
from app.core.schemas import (
    BaseSchema,
    CitySchema,
    ComponentTypeSchema,
    MediaTypeSchema,
    QuestionTypeSchema,
    RoleSchema,
    ViewTypeSchema,
)
from app.database import models
from app.database.models import City, Competition, ComponentType, MediaType, QuestionType, Role, User, ViewType
from flask.views import MethodView
from flask_smorest.error_handler import ErrorSchema
from marshmallow_sqlalchemy import auto_field

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint("misc", "misc", url_prefix="/api/misc", description="Roles, regions, types and statistics")


class TypesResponseSchema(BaseSchema):
    media_types = ma.fields.Nested(MediaTypeSchema, many=True)
    component_types = ma.fields.Nested(ComponentTypeSchema, many=True)
    question_types = ma.fields.Nested(QuestionTypeSchema, many=True)
    view_types = ma.fields.Nested(ViewTypeSchema, many=True)


@blp.route("/types")
class Types(MethodView):
    @blp.response(http_codes.OK, TypesResponseSchema)
    def get(self):
        """Gets a list of all types"""
        return dict(
            media_types=dbc.get.all(MediaType),
            component_types=dbc.get.all(ComponentType),
            question_types=dbc.get.all(QuestionType),
            view_types=dbc.get.all(ViewType),
        )


@blp.route("/roles")
class RoleList(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, RoleSchema(many=True))
    def get(self):
        """Gets a list of all roles."""
        return dbc.get.all(Role)


class CityAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.City

    name = auto_field()


@blp.route("/cities")
class CitiesList(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, CitySchema(many=True))
    def get(self):
        """Gets a list of all cities."""
        return dbc.get.all(City, order_columns=(City.name,))

    @blp.authorization(allowed_roles=["Admin"])
    @blp.arguments(CitySchema)
    @blp.response(http_codes.OK, CitySchema(many=True))
    def post(self, args):
        """Posts the specified city."""
        dbc.add.city(**args)
        return dbc.get.all(City, order_columns=(City.name,))


@blp.route("/cities/<city_id>")
class Cities(MethodView):
    @blp.authorization(allowed_roles=["Admin"])
    @blp.arguments(CitySchema)
    @blp.response(http_codes.OK, CitySchema(many=True))
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="City not found")
    @blp.alt_response(
        http_codes.CONFLICT, ErrorSchema, description="The city can't be updated with the provided values"
    )
    def put(self, args, city_id):
        """Edits the specified city with the provided arguments."""
        dbc.edit.default(dbc.get.one(City, city_id), **args)
        return dbc.get.all(City, order_columns=(City.name,))

    @blp.authorization(allowed_roles=["Admin"])
    @blp.response(http_codes.OK, CitySchema(many=True))
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="City not found")
    @blp.alt_response(
        http_codes.CONFLICT, ErrorSchema, description="The city can't be updated with the provided values"
    )
    def delete(self, city_id):
        """Deletes the specified city."""
        dbc.delete.default(dbc.get.one(City, city_id))
        return dbc.get.all(City, order_columns=(City.name,))


class StatisticsResponseSchema(BaseSchema):
    users = ma.fields.Int()
    competitions = ma.fields.Int()
    regions = ma.fields.Int()


@blp.route("/statistics")
class Statistics(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, StatisticsResponseSchema)
    def get(self):
        """Gets statistics."""
        return {"users": User.query.count(), "competitions": Competition.query.count(), "regions": City.query.count()}
