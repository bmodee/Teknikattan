import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import TeamDTO
from app.core.parsers import team_parser
from app.database.models import Competition, Team
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, reqparse

api = TeamDTO.api
schema = TeamDTO.schema
list_schema = TeamDTO.list_schema


@api.route("/")
@api.param("CID")
class TeamsList(Resource):
    @jwt_required
    def get(self, CID):
        items = dbc.get.team_list(CID)
        return list_response(list_schema.dump(items))

    @jwt_required
    def post(self, CID):
        args = team_parser.parse_args(strict=True)
        item_comp = dbc.get.competition(CID)
        item_team = dbc.add.team(args["name"], item_comp)
        return item_response(schema.dump(item_team))


@api.route("/<TID>")
@api.param("CID,TID")
class Teams(Resource):
    @jwt_required
    def get(self, CID, TID):
        item = dbc.get.team(CID, TID)
        return item_response(schema.dump(item))

    @jwt_required
    def delete(self, CID, TID):
        item_team = dbc.get.team(CID, TID)

        dbc.delete.team(item_team)
        return {}, codes.NO_CONTENT

    @jwt_required
    def put(self, CID, TID):
        args = team_parser.parse_args(strict=True)
        name = args.get("name")

        item_team = dbc.get.team(CID, TID)

        item_team = dbc.edit.team(item_team, name=name, competition_id=CID)
        return item_response(schema.dump(item_team))
