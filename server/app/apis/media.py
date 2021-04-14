import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import admin_required, item_response, list_response
from app.core.dto import MediaDTO
from app.core.parsers import media_parser_search
from app.database.models import City, Media, MediaType, QuestionType, Role
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, reqparse
from flask_uploads import UploadNotAllowed
from PIL import Image

api = MediaDTO.api
image_set = MediaDTO.image_set
schema = MediaDTO.schema
list_schema = MediaDTO.list_schema


def generate_thumbnail(filename):
    with Image.open(f"./static/images/{filename}") as im:
        im.thumbnail((120, 120))
        im.save(f"./static/images/thumbnail_{filename}")


@api.route("/images")
class ImageList(Resource):
    @jwt_required
    def get(self):
        args = media_parser_search.parse_args(strict=True)
        items, total = dbc.search.image(**args)
        return list_response(list_schema.dump(items), total)

    @jwt_required
    def post(self):
        if "image" not in request.files:
            api.abort(codes.BAD_REQUEST, "Missing image in request.files")

        try:
            filename = image_set.save(request.files["image"])
            generate_thumbnail(filename)
            print(filename)
            item = dbc.add.image(filename, get_jwt_identity())
            return item_response(schema.dump(item))
        except UploadNotAllowed:
            api.abort(codes.BAD_REQUEST, "Could not save the image")
        except:
            api.abort(codes.INTERNAL_SERVER_ERROR, "Something went wrong when trying to save image")
