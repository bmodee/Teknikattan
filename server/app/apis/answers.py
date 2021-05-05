"""
All API calls concerning question answers.
Default route: /api/competitions/<competition_id>/teams/<team_id>/answers
"""

import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionAnswerDTO
from app.core.parsers import sentinel
from flask_restx import Resource, reqparse

api = QuestionAnswerDTO.api
schema = QuestionAnswerDTO.schema
list_schema = QuestionAnswerDTO.list_schema

answer_parser_add = reqparse.RequestParser()
answer_parser_add.add_argument("answer", type=str, required=True, location="json")
answer_parser_add.add_argument("score", type=int, required=True, location="json")
answer_parser_add.add_argument("question_id", type=int, required=True, location="json")

answer_parser_edit = reqparse.RequestParser()
answer_parser_edit.add_argument("answer", type=str, default=sentinel, location="json")
answer_parser_edit.add_argument("score", type=int, default=sentinel, location="json")


@api.route("")
@api.param("competition_id, team_id")
class QuestionAnswerList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, team_id):
        """ Gets all question answers that the specified team has given. """

        items = dbc.get.question_answer_list(competition_id, team_id)
        return list_response(list_schema.dump(items))

    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def post(self, competition_id, team_id):
        """
        Posts a new question answer to the specified
        question using the provided arguments.
        """

        args = answer_parser_add.parse_args(strict=True)
        item = dbc.add.question_answer(**args, team_id=team_id)
        return item_response(schema.dump(item))


@api.route("/<answer_id>")
@api.param("competition_id, team_id, answer_id")
class QuestionAnswers(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, team_id, answer_id):
        """ Gets the specified question answer. """

        item = dbc.get.question_answer(competition_id, team_id, answer_id)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def put(self, competition_id, team_id, answer_id):
        """ Edits the specified question answer with the provided arguments. """

        args = answer_parser_edit.parse_args(strict=True)
        item = dbc.get.question_answer(competition_id, team_id, answer_id)
        item = dbc.edit.default(item, **args)
        return item_response(schema.dump(item))

    # No need to delete an answer. It only needs to be deleted
    # together with the question or the team.
