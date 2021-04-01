import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required
from app.core.dto import CompetitionDTO
from app.core.models import Competition, Slide, Team
from app.core.parsers import competition_parser, competition_search_parser
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, reqparse

api = CompetitionDTO.api
competition_model = CompetitionDTO.model
competition_list_model = CompetitionDTO.user_list_model


def get_comp(CID):
    return Competition.query.filter(Competition.id == CID).first()


@api.route("/")
class CompetitionsList(Resource):
    @jwt_required
    @api.marshal_with(competition_model)
    def post(self):
        args = competition_parser.parse_args(strict=True)

        name = args.get("name")
        city_id = args.get("city_id")
        year = args.get("year")
        style_id = args.get("style_id")

        # Add competition
        item_competition = dbc.add.default(Competition(name, year, style_id, city_id))

        # Add default slide
        item_slide = dbc.add.slide(item_competition.id)

        return item_competition


@api.route("/<ID>")
@api.param("ID")
class Competitions(Resource):
    @jwt_required
    @api.marshal_with(competition_model)
    def get(self, ID):
        item = get_comp(ID)
        return item

    @jwt_required
    @api.marshal_with(competition_model)
    def put(self, ID):
        args = competition_parser.parse_args(strict=True)

        item = get_comp(ID)
        name = args.get("name")
        year = args.get("year")
        city_id = args.get("city_id")
        style_id = args.get("style_id")
        return dbc.edit.competition(item, name, year, city_id, style_id)

    @jwt_required
    def delete(self, ID):
        item = get_comp(ID)
        dbc.delete.competition(item)
        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @jwt_required
    @api.marshal_with(competition_list_model)
    def get(self):
        args = competition_search_parser.parse_args(strict=True)
        name = args.get("name")
        year = args.get("year")
        city_id = args.get("city_id")
        style_id = args.get("style_id")
        page = args.get("page", 0)
        page_size = args.get("page_size", 15)
        result, total = dbc.get.search_competitions(name, year, city_id, style_id, page, page_size)

        return {"competitions": result, "count": len(result), "total": total}
