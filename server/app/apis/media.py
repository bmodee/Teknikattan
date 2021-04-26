import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import check_jwt, item_response, list_response
from app.core.dto import MediaDTO
from app.core.parsers import media_parser_search
from app.database.models import City, Media, MediaType, QuestionType, Role
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, reqparse
from flask_uploads import UploadNotAllowed
from sqlalchemy import exc
import app.core.files as files

api = MediaDTO.api
image_set = MediaDTO.image_set
schema = MediaDTO.schema
list_schema = MediaDTO.list_schema


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
            filename = files.save_image_with_thumbnail(request.files["image"])
            item = Media.query.filter(Media.filename == filename).first()
            if not item:
                item = dbc.add.image(filename, get_jwt_identity())

            return item_response(schema.dump(item))
        except UploadNotAllowed:
            api.abort(codes.BAD_REQUEST, "Could not save the image")
        except:
            api.abort(codes.INTERNAL_SERVER_ERROR, "Something went wrong when trying to save image")


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
            files.delete_image_and_thumbnail(item.filename)
            dbc.delete.default(item)
            return {}, codes.NO_CONTENT
        except OSError:
            api.abort(codes.BAD_REQUEST, "Could not delete the file image")
        except exc.SQLAlchemyError:
            api.abort(codes.INTERNAL_SERVER_ERROR, "Something went wrong when trying to delete image")
