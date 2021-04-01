import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required
from app.core.dto import TeamDTO
from app.core.models import Competition, Team
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, reqparse

api = TeamDTO.api
model = TeamDTO.model


def get_comp(CID):
    return Competition.query.filter(Competition.id == CID).first()


@api.route("/")
@api.param("CID")
class TeamsList(Resource):
    @jwt_required
    @api.marshal_with(model)
    def get(self, CID):
        item_comp = get_comp(CID)
        return item_comp.teams

    @jwt_required
    @api.marshal_with(model)
    def post(self, CID):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, location="json")
        args = parser.parse_args(strict=True)

        dbc.add.default(Team(args["name"], CID))
        item_comp = get_comp(CID)
        return item_comp.teams


@api.route("/<TID>")
@api.param("CID,TID")
class Teams(Resource):
    @jwt_required
    @api.marshal_with(model)
    def get(self, CID, TID):
        item_team = dbc.get.team(CID, TID)
        return item_team

    @jwt_required
    def delete(self, CID, TID):
        item_team = dbc.get.team(CID, TID)
        dbc.delete.team(item_team)
        return "deleted"
