"""
All API calls concerning question alternatives.
Default route: /api/competitions/<competition_id>/teams
"""

from flask_smorest.error_handler import ErrorSchema
import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, TeamSchema
from app.database import models
from flask.views import MethodView

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "team",
    "team",
    url_prefix="/api/competitions/<competition_id>/teams",
    description="Operations on teams",
)


class TeamAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Team

    name = ma.auto_field(required=True)


class TeamEditArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Team

    name = ma.auto_field(required=False)


@blp.route("")
class Teams(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, TeamSchema(many=True))
    def get(self, competition_id):
        """ Gets all teams to the specified competition. """
        return dbc.get.team_list(competition_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(TeamAddArgsSchema)
    @blp.response(http_codes.OK, TeamSchema)
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not add team")
    def post(self, args, competition_id):
        """ Posts a new team to the specified competition. """
        return dbc.add.team(args["name"], competition_id)


@blp.route("/<team_id>")
class TeamsById(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, TeamSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find team")
    def get(self, competition_id, team_id):
        """ Gets the specified team. """
        return dbc.get.team(competition_id, team_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(TeamEditArgsSchema)
    @blp.response(http_codes.OK, TeamSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find team")
    def put(self, args, competition_id, team_id):
        """ Edits the specified team using the provided arguments. """
        return dbc.edit.default(dbc.get.team(competition_id, team_id), **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find team")
    def delete(self, competition_id, team_id):
        """ Deletes the specified team. """
        dbc.delete.team(dbc.get.team(competition_id, team_id))
        return None
