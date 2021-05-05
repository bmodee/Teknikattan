"""
All API calls concerning question alternatives.
Default route: /api/competitions/<competition_id>/slides/<slide_id>/questions/<question_id>/alternatives
"""

import app.core.http_codes as codes
import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionAlternativeDTO
from app.core.parsers import sentinel
from flask_restx import Resource, reqparse

api = QuestionAlternativeDTO.api
schema = QuestionAlternativeDTO.schema
list_schema = QuestionAlternativeDTO.list_schema

alternative_parser_add = reqparse.RequestParser()
alternative_parser_add.add_argument("text", type=str, required=True, location="json")
alternative_parser_add.add_argument("value", type=int, required=True, location="json")

alternative_parser_edit = reqparse.RequestParser()
alternative_parser_edit.add_argument("text", type=str, default=sentinel, location="json")
alternative_parser_edit.add_argument("value", type=int, default=sentinel, location="json")


@api.route("")
@api.param("competition_id, slide_id, question_id")
class QuestionAlternativeList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, question_id):
        """ Gets the all question alternatives to the specified question. """

        items = dbc.get.question_alternative_list(
            competition_id,
            slide_id,
            question_id,
        )
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def post(self, competition_id, slide_id, question_id):
        """
        Posts a new question alternative to the specified
        question using the provided arguments.
        """

        args = alternative_parser_add.parse_args(strict=True)
        item = dbc.add.question_alternative(**args, question_id=question_id)
        return item_response(schema.dump(item))


@api.route("/<alternative_id>")
@api.param("competition_id, slide_id, question_id, alternative_id")
class QuestionAlternatives(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, slide_id, question_id, alternative_id):
        """ Gets the specified question alternative. """

        items = dbc.get.question_alternative(
            competition_id,
            slide_id,
            question_id,
            alternative_id,
        )
        return item_response(schema.dump(items))

    @protect_route(allowed_roles=["*"])
    def put(self, competition_id, slide_id, question_id, alternative_id):
        """
        Edits the specified question alternative using the provided arguments.
        """

        args = alternative_parser_edit.parse_args(strict=True)
        item = dbc.get.question_alternative(
            competition_id,
            slide_id,
            question_id,
            alternative_id,
        )
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"])
    def delete(self, competition_id, slide_id, question_id, alternative_id):
        """ Deletes the specified question alternative. """

        item = dbc.get.question_alternative(
            competition_id,
            slide_id,
            question_id,
            alternative_id,
        )
        dbc.delete.default(item)
        return {}, codes.NO_CONTENT
