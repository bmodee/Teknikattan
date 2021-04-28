import time

import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import CompetitionDTO
from app.database.models import Competition
from flask_restx import Resource
from flask_restx import reqparse
from app.core.parsers import search_parser, sentinel

api = CompetitionDTO.api
schema = CompetitionDTO.schema
rich_schema = CompetitionDTO.rich_schema
list_schema = CompetitionDTO.list_schema

competition_parser_add = reqparse.RequestParser()
competition_parser_add.add_argument("name", type=str, required=True, location="json")
competition_parser_add.add_argument("year", type=int, required=True, location="json")
competition_parser_add.add_argument("city_id", type=int, required=True, location="json")

competition_parser_edit = reqparse.RequestParser()
competition_parser_edit.add_argument("name", type=str, default=sentinel, location="json")
competition_parser_edit.add_argument("year", type=int, default=sentinel, location="json")
competition_parser_edit.add_argument("city_id", type=int, default=sentinel, location="json")
competition_parser_edit.add_argument("background_image_id", default=sentinel, type=int, location="json")

competition_parser_search = search_parser.copy()
competition_parser_search.add_argument("name", type=str, default=sentinel, location="args")
competition_parser_search.add_argument("year", type=int, default=sentinel, location="args")
competition_parser_search.add_argument("city_id", type=int, default=sentinel, location="args")


@api.route("")
class CompetitionsList(Resource):
    @protect_route(allowed_roles=["*"])
    def post(self):
        args = competition_parser_add.parse_args(strict=True)

        # Add competition
        item = dbc.add.competition(**args)

        # Add default slide
        # dbc.add.slide(item.id)
        return item_response(schema.dump(item))


@api.route("/<competition_id>")
@api.param("competition_id")
class Competitions(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id):
        item = dbc.get.competition(competition_id)

        return item_response(rich_schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id):
        args = competition_parser_edit.parse_args(strict=True)
        item = dbc.get.one(Competition, competition_id)
        item = dbc.edit.default(item, **args)

        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id):
        item = dbc.get.one(Competition, competition_id)
        dbc.delete.competition(item)

        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self):
        args = competition_parser_search.parse_args(strict=True)
        items, total = dbc.search.competition(**args)
        return list_response(list_schema.dump(items), total)


@api.route("/<competition_id>/copy")
@api.param("competition_id")
class SlidesOrder(Resource):
    @protect_route(allowed_roles=["*"])
    def post(self, competition_id):
        item_competition = dbc.get.competition(competition_id)

        item_competition_copy = dbc.copy.competition(item_competition)

        return item_response(schema.dump(item_competition_copy))
