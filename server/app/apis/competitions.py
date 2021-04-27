import time

import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import CompetitionDTO
from app.database.models import Competition
from flask_restx import Resource
from flask_restx import reqparse
from app.core.parsers import search_parser

api = CompetitionDTO.api
schema = CompetitionDTO.schema
rich_schema = CompetitionDTO.rich_schema
list_schema = CompetitionDTO.list_schema

competition_parser = reqparse.RequestParser()
competition_parser.add_argument("name", type=str, location="json")
competition_parser.add_argument("year", type=int, location="json")
competition_parser.add_argument("city_id", type=int, location="json")

competition_search_parser = search_parser.copy()
competition_search_parser.add_argument("name", type=str, default=None, location="args")
competition_search_parser.add_argument("year", type=int, default=None, location="args")
competition_search_parser.add_argument("city_id", type=int, default=None, location="args")


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
