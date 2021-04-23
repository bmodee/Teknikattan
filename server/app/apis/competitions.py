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


@api.route("")
class CompetitionsList(Resource):
    @check_jwt(editor=True)
    def post(self):
        args = competition_parser.parse_args(strict=True)

        # Add competition
        item = dbc.add.competition(**args)

        # Add default slide
        # dbc.add.slide(item.id)
        return item_response(schema.dump(item))


@api.route("/<competition_id>")
@api.param("competition_id")
class Competitions(Resource):
    @check_jwt(editor=True)
    def get(self, competition_id):
        item = dbc.get.competition(competition_id)

        return item_response(rich_schema.dump(item))

    @check_jwt(editor=True)
    def put(self, competition_id):
        args = competition_parser.parse_args(strict=True)
        item = dbc.get.one(Competition, competition_id)
        item = dbc.edit.default(item, **args)

        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def delete(self, competition_id):
        item = dbc.get.one(Competition, competition_id)
        dbc.delete.competition(item)

        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @check_jwt(editor=True)
    def get(self):
        args = competition_search_parser.parse_args(strict=True)
        items, total = dbc.search.competition(**args)
        return list_response(list_schema.dump(items), total)


@api.route("/<competition_id>/copy")
@api.param("competition_id")
class SlidesOrder(Resource):
    @check_jwt(editor=True)
    def post(self, competition_id):
        item_competition = dbc.get.competition(competition_id)

        item_competition_copy = dbc.copy.competition(item_competition)

        return item_response(schema.dump(item_competition_copy))
