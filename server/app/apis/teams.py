import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, list_response
from app.core.dto import TeamDTO
from app.core.models import Competition, Team
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
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, location="json")
        args = parser.parse_args(strict=True)

        item_comp = get_comp(CID)
        dbc.add.team(args["name"], item_comp)
        dbc.refresh(item_comp)
        return list_response(list_schema.dump(item_comp.teams))


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
        return "deleted"
