"""
All API calls concerning question alternatives.
Default route: /api/competitions/<competition_id>/slides
"""

import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, SlideSchema
from app.database import models
from app.database.models import Competition, Slide
from flask.views import MethodView
from flask_smorest import abort
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "slide",
    "slide",
    url_prefix="/api/competitions/<competition_id>/slides",
    description="Adding, updating, deleting and copy slide",
)


class SlideEditArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Slide

    title = ma.auto_field(required=False)
    timer = ma.auto_field(required=False)
    order = ma.auto_field(required=False, missing=None)
    background_image_id = ma.auto_field(required=False)


@blp.route("")
class Slides(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, SlideSchema(many=True))
    def get(self, competition_id):
        """ Gets all slides from the specified competition. """
        return dbc.get.slide_list(competition_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, SlideSchema)
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Can't add slide")
    def post(self, competition_id):
        """ Posts a new slide to the specified competition. """
        return dbc.add.slide(competition_id)


@blp.route("/<slide_id>")
class Slides(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, SlideSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema)
    def get(self, competition_id, slide_id):
        """ Gets the specified slide. """
        return dbc.get.slide(competition_id, slide_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(SlideEditArgsSchema)
    @blp.response(http_codes.OK, SlideSchema)
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Can't edit slide")
    @blp.alt_response(http_codes.BAD_REQUEST, ErrorSchema, description="Can't edit slide with the provided arguments")
    def put(self, args, competition_id, slide_id):
        """ Edits the specified slide using the provided arguments. """

        item_slide = dbc.get.slide(competition_id, slide_id)

        new_order = args.pop("order")
        if new_order is not None and item_slide.order != new_order:
            if not (0 <= new_order < dbc.utils.count(Slide, {"competition_id": competition_id})):
                abort(http_codes.BAD_REQUEST, f"Cant change to invalid slide order '{new_order}'")

            item_competition = dbc.get.one(Competition, competition_id)
            dbc.utils.move_order(item_competition.slides, "order", item_slide.order, new_order)

        return dbc.edit.default(item_slide, **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Slide not found")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Can't delete slide")
    def delete(self, competition_id, slide_id):
        """ Deletes the specified slide. """
        dbc.delete.slide(dbc.get.slide(competition_id, slide_id))
        return None


@blp.route("/<slide_id>/copy")
class SlideCopy(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, SlideSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Can't find slide")
    def post(self, competition_id, slide_id):
        """ Creates a deep copy of the specified slide. """
        return dbc.copy.slide(dbc.get.slide(competition_id, slide_id))
