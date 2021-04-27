import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import TeamDTO
from flask_restx import Resource, reqparse
from flask_restx import reqparse

api = TeamDTO.api
schema = TeamDTO.schema
list_schema = TeamDTO.list_schema

team_parser = reqparse.RequestParser()
team_parser.add_argument("name", type=str, location="json")


@api.route("")
@api.param("competition_id")
class TeamsList(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id):
        items = dbc.get.team_list(competition_id)
        return list_response(list_schema.dump(items))

    @check_jwt(editor=True)
    def post(self, competition_id):
        args = team_parser.parse_args(strict=True)
        item_team = dbc.add.team(args["name"], competition_id)
        return item_response(schema.dump(item_team))


@api.route("/<team_id>")
@api.param("competition_id,team_id")
class Teams(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id, team_id):
        item = dbc.get.team(competition_id, team_id)
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def delete(self, competition_id, team_id):
        item_team = dbc.get.team(competition_id, team_id)

        dbc.delete.team(item_team)
        return {}, codes.NO_CONTENT

    @check_jwt(editor=True)
    def put(self, competition_id, team_id):
        args = team_parser.parse_args(strict=True)
        name = args.get("name")

        item_team = dbc.get.team(competition_id, team_id)

        item_team = dbc.edit.default(item_team, name=name, competition_id=competition_id)
        return item_response(schema.dump(item_team))
