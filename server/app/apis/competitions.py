import time

import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core import rich_schemas
from app.core.dto import CompetitionDTO
from app.core.parsers import competition_parser, competition_search_parser
from app.database.models import Competition
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = CompetitionDTO.api
schema = CompetitionDTO.schema
rich_schema = CompetitionDTO.rich_schema
list_schema = CompetitionDTO.list_schema


@api.route("/")
class CompetitionsList(Resource):
    @check_jwt(editor=True)
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
    @check_jwt(editor=True)
    def get(self, CID):
        item = dbc.get.competition(CID)

        return item_response(rich_schema.dump(item))

    @check_jwt(editor=True)
    def put(self, CID):
        args = competition_parser.parse_args(strict=True)
        item = dbc.get.one(Competition, CID)
        item = dbc.edit.competition(item, **args)

        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def delete(self, CID):
        item = dbc.get.one(Competition, CID)
        dbc.delete.competition(item)

        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @check_jwt(editor=True)
    def get(self):
        args = competition_search_parser.parse_args(strict=True)
        items, total = dbc.search.competition(**args)
        return list_response(list_schema.dump(items), total)
