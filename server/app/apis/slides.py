import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import SlideDTO
from app.core.parsers import slide_parser
from app.database.models import Competition, Slide
from flask_jwt_extended import jwt_required
from flask_restx import Resource

api = SlideDTO.api
schema = SlideDTO.schema
list_schema = SlideDTO.list_schema


@api.route("/")
@api.param("CID")
class SlidesList(Resource):
    @jwt_required
    def get(self, CID):
        items = dbc.get.slide_list(CID)
        return list_response(list_schema.dump(items))

    @jwt_required
    def post(self, CID):
        item_comp = dbc.get.one(Competition, CID)
        item_slide = dbc.add.slide(item_comp)
        dbc.add.question(f"Fråga {item_slide.order + 1}", 10, 0, item_slide)
        dbc.utils.refresh(item_comp)
        return list_response(list_schema.dump(item_comp.slides))


@api.route("/<SOrder>")
@api.param("CID,SOrder")
class Slides(Resource):
    @jwt_required
    def get(self, CID, SOrder):
        item_slide = dbc.get.slide(CID, SOrder)
        return item_response(schema.dump(item_slide))

    @jwt_required
    def put(self, CID, SOrder):
        args = slide_parser.parse_args(strict=True)
        title = args.get("title")
        timer = args.get("timer")

        item_slide = dbc.get.slide(CID, SOrder)
        item_slide = dbc.edit.slide(item_slide, title, timer)

        return item_response(schema.dump(item_slide))

    @jwt_required
    def delete(self, CID, SOrder):
        item_slide = dbc.get.slide(CID, SOrder)

        dbc.delete.slide(item_slide)
        return {}, codes.NO_CONTENT


@api.route("/<SOrder>/order")
@api.param("CID,SOrder")
class SlidesOrder(Resource):
    @jwt_required
    def put(self, CID, SOrder):
        args = slide_parser.parse_args(strict=True)
        order = args.get("order")

        item_slide = dbc.get.slide(CID, SOrder)

        if order == item_slide.order:
            return item_response(schema.dump(item_slide))

        # clamp order between 0 and max
        order_count = dbc.get.slide_count(CID)
        if order < 0:
            order = 0
        elif order >= order_count - 1:
            order = order_count - 1

        # get slide at the requested order
        item_slide_order = dbc.get.slide(CID, order)

        # switch place between them
        item_slide = dbc.edit.switch_order(item_slide, item_slide_order)

        return item_response(schema.dump(item_slide))
