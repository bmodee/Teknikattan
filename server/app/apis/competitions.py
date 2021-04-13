import app.database.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import CompetitionDTO
from app.core.parsers import competition_parser, competition_search_parser
from app.database.models import Competition
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = CompetitionDTO.api
schema = CompetitionDTO.schema
list_schema = CompetitionDTO.list_schema


@api.route("/")
class CompetitionsList(Resource):
    @jwt_required
    def post(self):
        args = competition_parser.parse_args(strict=True)

        # Add competition
        item = dbc.add.competition(**args)

        # Add default slide
        dbc.add.slide(item)
        return item_response(schema.dump(item))


@api.route("/<CID>")
@api.param("CID")
class Competitions(Resource):
    @jwt_required
    def get(self, CID):
        item = dbc.get.competition(CID)
        return item_response(schema.dump(item))

    @jwt_required
    def put(self, CID):
        args = competition_parser.parse_args(strict=True)
        item = dbc.get.competition(CID)
        item = dbc.edit.competition(item, **args)

        return item_response(schema.dump(item))

    @jwt_required
    def delete(self, CID):
        item = dbc.get.competition(CID)
        dbc.delete.competition(item)

        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @jwt_required
    def get(self):
        args = competition_search_parser.parse_args(strict=True)
        items, total = dbc.search.user(**args)
        return list_response(list_schema.dump(items), total)
