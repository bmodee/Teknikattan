import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, list_response
from app.core.dto import TeamDTO
from app.core.models import Competition, Team
from app.core.parsers import team_parser
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, reqparse

api = TeamDTO.api
schema = TeamDTO.schema
list_schema = TeamDTO.list_schema


def get_comp(CID):
    return Competition.query.filter(Competition.id == CID).first()


@api.route("/")
@api.param("CID")
class TeamsList(Resource):
    @jwt_required
    def get(self, CID):
        item_comp = get_comp(CID)
        return list_response(list_schema.dump(item_comp.teams))

    @jwt_required
    def post(self, CID):
        args = team_parser.parse_args(strict=True)
        item_comp = get_comp(CID)
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
        if not item_team:
            api.abort(codes.NOT_FOUND, f"Could not find team with id {TID} in competition with id {CID}.")

        dbc.delete.team(item_team)
        return {}, codes.NO_CONTENT

    @jwt_required
    def put(self, CID, TID):
        args = team_parser.parse_args(strict=True)
        name = args.get("name")

        item_team = dbc.get.team(CID, TID)
        if not item_team:
            api.abort(codes.NOT_FOUND, f"Could not find team with id {TID} in competition with id {CID}.")

        item_team = dbc.edit.team(item_team, name=name, competition_id=CID)
        return item_response(schema.dump(item_team))
