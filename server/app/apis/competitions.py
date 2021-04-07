import app.core.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import CompetitionDTO
from app.core.models import Competition
from app.core.parsers import competition_parser, competition_search_parser
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = CompetitionDTO.api
schema = CompetitionDTO.schema
list_schema = CompetitionDTO.list_schema


def get_comp(CID):
    return Competition.query.filter(Competition.id == CID).first()


@api.route("/")
class CompetitionsList(Resource):
    @jwt_required
    def post(self):
        args = competition_parser.parse_args(strict=True)

        name = args.get("name")
        city_id = args.get("city_id")
        year = args.get("year")

        # Add competition
        item = dbc.add.competition(name, year, city_id)

        # Add default slide
        dbc.add.slide(item)

        dbc.refresh(item)
        return item_response(schema.dump(item))


@api.route("/<ID>")
@api.param("ID")
class Competitions(Resource):
    @jwt_required
    def get(self, ID):
        item = get_comp(ID)
        return item_response(schema.dump(item))

    @jwt_required
    def put(self, ID):
        args = competition_parser.parse_args(strict=True)

        item = get_comp(ID)
        name = args.get("name")
        year = args.get("year")
        city_id = args.get("city_id")
        item = dbc.edit.competition(item, name, year, city_id)
        return item_response(schema.dump(item))

    @jwt_required
    def delete(self, ID):
        item = get_comp(ID)
        dbc.delete.competition(item)
        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @jwt_required
    def get(self):
        args = competition_search_parser.parse_args(strict=True)
        name = args.get("name")
        year = args.get("year")
        city_id = args.get("city_id")
        page = args.get("page", 0)
        page_size = args.get("page_size", 15)
        order = args.get("order", 1)
        order_by = args.get("order_by")

        items, total = dbc.get.search_competitions(name, year, city_id, page, page_size, order, order_by)
        return list_response(list_schema.dump(items), total)
