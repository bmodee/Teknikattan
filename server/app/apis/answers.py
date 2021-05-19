"""
All API calls concerning question answers.
Default route: /api/competitions/<competition_id>/teams/<team_id>/answers
"""

import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionAlternativeAnswerDTO, QuestionScoreDTO
from app.core.parsers import sentinel
from flask_restx import Resource, reqparse

api = QuestionAlternativeAnswerDTO.api
schema = QuestionAlternativeAnswerDTO.schema
list_schema = QuestionAlternativeAnswerDTO.list_schema

score_schema = QuestionScoreDTO.schema
score_list_schema = QuestionScoreDTO.list_schema


answer_parser_add = reqparse.RequestParser()
answer_parser_add.add_argument("answer", type=str, required=True, location="json")

answer_parser_edit = reqparse.RequestParser()
answer_parser_edit.add_argument("answer", type=str, default=sentinel, location="json")


@api.route("/question_alternatives")
@api.param("competition_id, team_id")
class QuestionAlternativeList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, team_id):
        """ Gets all question answers that the specified team has given. """

        items = dbc.get.question_alternative_answer_list(competition_id, team_id)
        return list_response(list_schema.dump(items))


@api.route("/question_alternatives/<question_alternative_id>")
@api.param("competition_id, team_id, question_alternative_id")
class QuestionAlternativeAnswers(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, team_id, question_alternative_id):
        """ Gets the specified question answer. """

        item = dbc.get.question_alternative_answer(competition_id, team_id, question_alternative_id)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def put(self, competition_id, team_id, question_alternative_id):
        """ Add or edit specified quesiton_answer. """

        item = dbc.get.question_alternative_answer(competition_id, team_id, question_alternative_id, required=False)
        if item is None:
            args = answer_parser_add.parse_args(strict=True)
            item = dbc.add.question_alternative_answer(args.get("answer"), question_alternative_id, team_id)
        else:
            args = answer_parser_edit.parse_args(strict=True)
            item = dbc.edit.default(item, **args)

        return item_response(schema.dump(item))
