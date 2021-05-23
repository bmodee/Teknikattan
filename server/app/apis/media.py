"""
All API calls concerning media.
Default route: /api/media
"""

import app.core.files as files
import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, MediaSchema
from app.database import models
from flask import request
from flask.views import MethodView
from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from flask_smorest.error_handler import ErrorSchema
from flask_uploads import UploadNotAllowed
from sqlalchemy import exc

from . import ALL, ExtendedBlueprint, http_codes


class ImageSearchArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Media

    filename = ma.auto_field(required=False)


blp = ExtendedBlueprint("media", "media", url_prefix="/api/media", description="Operations on media")


@blp.route("/images")
class Images(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(ImageSearchArgsSchema, location="query")
    @blp.paginate()
    @blp.response(http_codes.OK, MediaSchema(many=True))
    def get(self, args, pagination_parameters):
        """ Gets a list of all images with the specified filename. """
        return dbc.search.image(pagination_parameters, **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, MediaSchema)
    @blp.alt_response(http_codes.BAD_REQUEST, ErrorSchema, description="Could not save image")
    @blp.alt_response(http_codes.INTERNAL_SERVER_ERROR, ErrorSchema, description="Could not save image")
    def post(self):
        """ Posts the specified image. """

        if "image" not in request.files:
            abort(http_codes.BAD_REQUEST, message="Missing image in request.files")
        try:
            filename = files.save_image_with_thumbnail(request.files["image"])
            item = models.Media.query.filter(models.Media.filename == filename).first()
            if not item:
                item = dbc.add.image(filename, get_jwt_identity())

            return item
        except UploadNotAllowed:
            abort(http_codes.BAD_REQUEST, message="Could not save the image")
        except:
            abort(http_codes.INTERNAL_SERVER_ERROR, message="Something went wrong when trying to save image")


@blp.route("/images/<media_id>")
class ImageById(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, MediaSchema)
    @blp.alt_response(http_codes.NOT_FOUND, MediaSchema, description="Could not find image")
    def get(self, media_id):
        """ Gets the specified image. """
        return dbc.get.one(models.Media, media_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.response(http_codes.CONFLICT, None, description="Could not delete image it is used by something")
    @blp.response(http_codes.BAD_REQUEST, None, description="Failed to delete image")
    @blp.response(http_codes.INTERNAL_SERVER_ERROR, ErrorSchema, description="Somehting very serious went wrong")
    def delete(self, media_id):
        """ Deletes the specified image. """
        item = dbc.get.one(models.Media, media_id)
        if len(item.image_components) > 0:
            abort(http_codes.CONFLICT, "Component depends on this Image")

        if len(item.competition_background_images) > 0:
            abort(http_codes.CONFLICT, "Competition background image depends on this Image")

        if len(item.slide_background_images) > 0:
            abort(http_codes.CONFLICT, "Slide background image depends on this Image")

        try:
            files.delete_image_and_thumbnail(item.filename)
            dbc.delete.default(item)
            return None
        except OSError:
            abort(http_codes.BAD_REQUEST, "Could not delete the file image")
        except exc.SQLAlchemyError:
            abort(http_codes.INTERNAL_SERVER_ERROR, "Something went wrong when trying to delete image")
