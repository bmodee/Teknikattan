import app.core.controller as dbc
import app.core.http_codes as codes
from app.apis import admin_required, item_response, list_response
from app.core.dto import SlideDTO
from app.core.models import Competition, Slide
from app.core.parsers import slide_parser
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = SlideDTO.api
schema = SlideDTO.schema
list_schema = SlideDTO.list_schema


def get_comp(CID):
    return Competition.query.filter(Competition.id == CID).first()


@api.route("/")
@api.param("CID")
class SlidesList(Resource):
    @jwt_required
    def get(self, CID):
        item_comp = get_comp(CID)
        return list_response(list_schema.dump(item_comp.slides))

    @jwt_required
    def post(self, CID):
        item_comp = get_comp(CID)
        dbc.add.slide(item_comp)
        dbc.refresh(item_comp)
        return list_response(list_schema.dump(item_comp.slides))


@api.route("/<SID>")
@api.param("CID,SID")
class Slides(Resource):
    @jwt_required
    def get(self, CID, SID):
        item_slide = dbc.get.slide(CID, SID)
        return item_response(schema.dump(item_slide))

    @jwt_required
    def put(self, CID, SID):
        args = slide_parser.parse_args(strict=True)
        title = args.get("title")
        timer = args.get("timer")

        item_slide = dbc.get.slide(CID, SID)
        item_slide = dbc.edit.slide(item_slide, title, timer)

        return item_response(schema.dump(item_slide))

    @jwt_required
    def delete(self, CID, SID):
        item_slide = dbc.get.slide(CID, SID)
        if not item_slide:
            return {"response": "No content found"}, codes.NOT_FOUND

        dbc.delete.slide(item_slide)
        return {}, codes.NO_CONTENT


@api.route("/<SID>/order")
@api.param("CID,SID")
class SlidesOrder(Resource):
    @jwt_required
    def put(self, CID, SID):
        args = slide_parser.parse_args(strict=True)
        order = args.get("order")

        item_slide = dbc.get.slide(CID, SID)

        if order == item_slide.order:
            api.abort(codes.BAD_REQUEST)

        # clamp order between 0 and max
        order_count = Slide.query.filter(Slide.competition_id == item_slide.competition_id).count()
        if order < 0:
            order = 0
        elif order >= order_count - 1:
            order = order_count - 1

        # get slide at the requested order
        item_slide_order = dbc.get.slide_by_order(CID, order)

        # switch place between them
        item_slide = dbc.edit.switch_order(item_slide, item_slide_order)

        return item_response(schema.dump(item_slide))
