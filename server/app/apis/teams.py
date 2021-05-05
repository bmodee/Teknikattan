"""
All API calls concerning question alternatives.
Default route: /api/competitions/<competition_id>/teams
"""

import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import TeamDTO
from app.core.parsers import sentinel
from flask_restx import Resource, reqparse

api = TeamDTO.api
schema = TeamDTO.schema
list_schema = TeamDTO.list_schema

team_parser_add = reqparse.RequestParser()
team_parser_add.add_argument("name", type=str, required=True, location="json")

team_parser_edit = reqparse.RequestParser()
team_parser_edit.add_argument("name", type=str, default=sentinel, location="json")


@api.route("")
@api.param("competition_id")
class TeamsList(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id):
        """ Gets all teams to the specified competition. """

        items = dbc.get.team_list(competition_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id):
        """ Posts a new team to the specified competition. """

        args = team_parser_add.parse_args(strict=True)
        item_team = dbc.add.team(args["name"], competition_id)
        return item_response(schema.dump(item_team))


@api.route("/<team_id>")
@api.param("competition_id,team_id")
class Teams(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id, team_id):
        """ Gets the specified team. """

        item = dbc.get.team(competition_id, team_id)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, team_id):
        """ Edits the specified team using the provided arguments. """

        args = team_parser_edit.parse_args(strict=True)
        name = args.get("name")

        item_team = dbc.get.team(competition_id, team_id)

        item_team = dbc.edit.default(item_team, name=name, competition_id=competition_id)
        return item_response(schema.dump(item_team))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, team_id):
        """ Deletes the specified team. """

        item_team = dbc.get.team(competition_id, team_id)

        dbc.delete.team(item_team)
        return {}, codes.NO_CONTENT
