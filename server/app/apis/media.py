import os

import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import MediaDTO
from app.core.parsers import media_parser_search
from app.database.models import City, Media, MediaType, QuestionType, Role
from flask import current_app, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, reqparse
from flask_uploads import UploadNotAllowed
from PIL import Image
from sqlalchemy import exc

api = MediaDTO.api
image_set = MediaDTO.image_set
schema = MediaDTO.schema
list_schema = MediaDTO.list_schema

PHOTO_PATH = current_app.config["UPLOADED_PHOTOS_DEST"]


def generate_thumbnail(filename):
    thumbnail_size = current_app.config["THUMBNAIL_SIZE"]
    path = os.path.join(PHOTO_PATH, filename)
    thumb_path = os.path.join(PHOTO_PATH, f"thumbnail_{filename}")
    with Image.open(path) as im:
        im.thumbnail(thumbnail_size)
        im.save(thumb_path)


def delete_image(filename):
    path = os.path.join(PHOTO_PATH, filename)
    thumb_path = os.path.join(PHOTO_PATH, f"thumbnail_{filename}")
    os.remove(path)
    os.remove(thumb_path)


@api.route("/images")
class ImageList(Resource):
    @check_jwt(editor=True)
    def get(self):
        args = media_parser_search.parse_args(strict=True)
        items, total = dbc.search.image(**args)
        return list_response(list_schema.dump(items), total)

    @check_jwt(editor=True)
    def post(self):
        if "image" not in request.files:
            api.abort(codes.BAD_REQUEST, "Missing image in request.files")
        try:
            filename = image_set.save(request.files["image"])
            generate_thumbnail(filename)
            print(filename)
            item = dbc.add.image(filename, get_jwt_identity())
        except UploadNotAllowed:
            api.abort(codes.BAD_REQUEST, "Could not save the image")
        except:
            api.abort(codes.INTERNAL_SERVER_ERROR, "Something went wrong when trying to save image")
        finally:
            return item_response(schema.dump(item))


@api.route("/images/<ID>")
@api.param("ID")
class ImageList(Resource):
    @check_jwt(editor=True)
    def get(self, ID):
        item = dbc.get.one(Media, ID)
        return item_response(schema.dump(item))

    @check_jwt(editor=True)
    def delete(self, ID):
        item = dbc.get.one(Media, ID)
        try:
            delete_image(item.filename)
            dbc.delete.default(item)
        except OSError:
            api.abort(codes.BAD_REQUEST, "Could not delete the file image")
        except exc.SQLAlchemyError:
            api.abort(codes.INTERNAL_SERVER_ERROR, "Something went wrong when trying to delete image")
        finally:
            return {}, codes.NO_CONTENT
