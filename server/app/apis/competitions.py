import app.core.controller as dbc
import app.core.utils.http_codes as codes
from app.apis import admin_required
from app.core.dto import CompetitionDTO
from app.core.models import Competition, Slide, Team
from app.core.parsers import competition_parser, competition_search_parser
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, reqparse

api = CompetitionDTO.api
competition_model = CompetitionDTO.model
slide_model = CompetitionDTO.slide_model
team_model = CompetitionDTO.team_model


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


@api.route("/<CID>/slides")
@api.param("CID")
class SlidesList(Resource):
    @jwt_required
    @api.marshal_with(slide_model)
    def get(self, CID):
        item_comp = get_comp(CID)
        return item_comp.slides

    @jwt_required
    @api.marshal_with(slide_model)
    def post(self, CID):
        dbc.add.slide(CID)
        item_comp = get_comp(CID)
        return item_comp.slides


@api.route("/<CID>/slides/<SID>")
@api.param("CID,SID")
class Slides(Resource):
    @jwt_required
    @api.marshal_with(slide_model)
    def get(self, CID, SID):
        item_slide = dbc.get.slide(CID, SID)
        return item_slide

    @jwt_required
    def delete(self, CID, SID):
        item_slide = dbc.get.slide(CID, SID)
        dbc.delete.slide(item_slide)
        return "deleted"


@api.route("/<CID>/teams")
@api.param("CID")
class TeamsList(Resource):
    @jwt_required
    @api.marshal_with(team_model)
    def get(self, CID):
        item_comp = get_comp(CID)
        return item_comp.teams

    @jwt_required
    @api.marshal_with(team_model)
    def post(self, CID):
        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, location="json")
        args = competition_parser.parse_args(strict=True)

        dbc.add.default(Team(args["name"], CID))
        item_comp = get_comp(CID)
        return item_comp.teams


@api.route("/<CID>/teams/<TID>")
@api.param("CID,TID")
class Teams(Resource):
    @jwt_required
    @api.marshal_with(team_model)
    def get(self, CID, TID):
        item_team = dbc.get.team(CID, TID)
        return item_team

    @jwt_required
    def delete(self, CID, TID):
        item_team = dbc.get.team(CID, TID)
        dbc.delete.team(item_team)
        return "deleted"
