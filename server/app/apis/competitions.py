import app.core.controller as dbc
import app.core.utils.http_codes as codes
from app.apis import admin_required
from app.core.models import Competition, User
from app.core.parsers import competition_parser, competition_search_parser
from app.core.schemas import competition_schema
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

api = Namespace("competitions")
competition_model = api.model(*competition_schema)


@api.route("/")
class CompetitionBase(Resource):
    @jwt_required
    @api.marshal_with(competition_model)
    def post(self):
        args = competition_parser.parse_args(strict=True)

        name = args.get("name")
        city_id = args.get("city_id")
        year = args.get("year")
        style_id = args.get("style_id")

        # Add competition
        item_competition = dbc.add.competition(name, year, style_id, city_id)

        # Add default slide
        item_slide = dbc.add.slide(item_competition.id)

        return item_competition


@api.route("/<ID>")
@api.param("ID")
class CompetitionByID(Resource):
    @jwt_required
    @api.marshal_with(competition_model)
    def get(self, ID):
        item = Competition.query.filter(Competition.id == ID).first()
        return item

    @jwt_required
    @api.marshal_with(competition_model)
    def put(self, ID):
        args = competition_parser.parse_args(strict=True)

        item = Competition.query.filter(Competition.id == ID).first()
        name = args.get("name")
        year = args.get("year")
        city_id = args.get("city_id")
        style_id = args.get("style_id")
        return dbc.edit.competition(item, name, year, city_id, style_id)

    @jwt_required
    def delete(self, ID):
        item = Competition.query.filter(Competition.id == ID).first()
        dbc.delete(item)
        return "deleted"


@api.route("/search")
class CompetitionSearch(Resource):
    @jwt_required
    @api.marshal_with(competition_model)
    def get(self):
        args = competition_search_parser.parse_args(strict=True)
        name = args.get("name")
        year = args.get("year")
        city_id = args.get("city_id")
        style_id = args.get("style_id")
        page = args.get("page")
        page_size = args.get("page_size")
        return dbc.get.search_competitions(name, year, city_id, style_id, page, page_size)
