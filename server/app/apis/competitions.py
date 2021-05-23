"""
All API calls concerning competitions.
Default route: /api/competitions
"""

import app.database.controller as dbc
from app.core import ma
from app.core.rich_schemas import CompetitionSchemaRich
from app.core.schemas import BaseSchema, CompetitionSchema
from app.database import models
from app.database.models import Competition
from flask.views import MethodView
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "competitions", "competitions", url_prefix="/api/competitions", description="Operations competitions"
)


class CompetitionAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Competition

    name = ma.auto_field()
    year = ma.auto_field()
    city_id = ma.auto_field()


class CompetitionEditArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Competition

    name = ma.auto_field(required=False)
    year = ma.auto_field(required=False)
    city_id = ma.auto_field(required=False)
    background_image_id = ma.auto_field(required=False)


class CompetitionSearchArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Competition

    name = ma.auto_field(required=False)
    year = ma.auto_field(required=False)
    city_id = ma.auto_field(required=False)
    background_image_id = ma.auto_field(required=False)


@blp.route("")
class Competitions(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(CompetitionAddArgsSchema)
    @blp.response(http_codes.OK, CompetitionSchema)
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Competition could not be added")
    def post(self, args):
        """ Adds a new competition. """
        return dbc.add.competition(**args)


@blp.route("/<competition_id>")
class CompetitionById(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, CompetitionSchemaRich)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Competition not found")
    def get(self, competition_id):
        """ Gets the specified competition. """
        return dbc.get.competition(competition_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(CompetitionEditArgsSchema)
    @blp.response(http_codes.OK, CompetitionSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Competition not found")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Competition could not be updated")
    def put(self, args, competition_id):
        """ Edits the specified competition with the specified arguments. """
        return dbc.edit.default(dbc.get.one(Competition, competition_id), **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Competition not found")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Competition could not be deleted")
    def delete(self, competition_id):
        """ Deletes the specified competition. """
        dbc.delete.competition(dbc.get.one(Competition, competition_id))
        return None


@blp.route("/search")
class CompetitionSearch(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(CompetitionSearchArgsSchema, location="query")
    @blp.paginate()
    @blp.response(http_codes.OK, CompetitionSchema(many=True))
    def get(self, args, pagination_parameters):
        """ Finds a specific competition based on the provided arguments. """
        return dbc.search.competition(pagination_parameters, **args)


@blp.route("/<competition_id>/copy")
class SlidesOrder(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, CompetitionSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Competition not found")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Competition could not be copied")
    def post(self, competition_id):
        """ Creates a deep copy of the specified competition. """
        return dbc.copy.competition(dbc.get.competition(competition_id))
