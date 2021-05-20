"""
All API calls concerning question alternatives.
Default route: /api/competitions/<competition_id>/slides
"""

import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import SlideDTO
from app.core.parsers import sentinel
from app.database.models import Competition, Slide
from flask_restx import Resource, reqparse
from flask_restx.errors import abort

api = SlideDTO.api
schema = SlideDTO.schema
list_schema = SlideDTO.list_schema

slide_parser_edit = reqparse.RequestParser()
slide_parser_edit.add_argument("order", type=int, default=sentinel, location="json")
slide_parser_edit.add_argument("title", type=str, default=sentinel, location="json")
slide_parser_edit.add_argument("timer", type=int, default=sentinel, location="json")
slide_parser_edit.add_argument("order", type=int, default=sentinel, location="json")
slide_parser_edit.add_argument("background_image_id", default=sentinel, type=int, location="json")


@api.route("")
@api.param("competition_id")
class SlidesList(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id):
        """ Gets all slides from the specified competition. """

        items = dbc.get.slide_list(competition_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id):
        """ Posts a new slide to the specified competition. """

        item_slide = dbc.add.slide(competition_id)
        return item_response(schema.dump(item_slide))


@api.route("/<slide_id>")
@api.param("competition_id, slide_id")
class Slides(Resource):
    @protect_route(allowed_roles=["*"])
    def get(self, competition_id, slide_id):
        """ Gets the specified slide. """

        item_slide = dbc.get.slide(competition_id, slide_id)
        return item_response(schema.dump(item_slide))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, slide_id):
        """ Edits the specified slide using the provided arguments. """

        args = slide_parser_edit.parse_args(strict=True)

        item_slide = dbc.get.slide(competition_id, slide_id)

        new_order = args.pop("order")
        if new_order is not sentinel and item_slide.order != new_order:
            if not (0 <= new_order < dbc.utils.count(Slide, {"competition_id": competition_id})):
                abort(codes.BAD_REQUEST, f"Cant change to invalid slide order '{new_order}'")

            item_competition = dbc.get.one(Competition, competition_id)
            dbc.utils.move_order(item_competition.slides, "order", item_slide.order, new_order)

        item_slide = dbc.edit.default(item_slide, **args)

        return item_response(schema.dump(item_slide))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id):
        """ Deletes the specified slide. """

        item_slide = dbc.get.slide(competition_id, slide_id)

        dbc.delete.slide(item_slide)
        return {}, codes.NO_CONTENT


@api.route("/<slide_id>/copy")
@api.param("competition_id,slide_id")
class SlideCopy(Resource):
    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id):
        """ Creates a deep copy of the specified slide. """

        item_slide = dbc.get.slide(competition_id, slide_id)
        item_slide_copy = dbc.copy.slide(item_slide)

        return item_response(schema.dump(item_slide_copy))
