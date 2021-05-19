"""
All API calls concerning question score.
Default route: /api/competitions/<competition_id>/teams/<team_id>/answers/quesiton_scores
"""

import app.database.controller as dbc
from app.apis import item_response, list_response, protect_route
from app.core.dto import QuestionScoreDTO
from app.core.parsers import sentinel
from flask_restx import Resource, reqparse

api = QuestionScoreDTO.api
schema = QuestionScoreDTO.schema
list_schema = QuestionScoreDTO.list_schema

score_parser_add = reqparse.RequestParser()
score_parser_add.add_argument("score", type=int, required=False, location="json")

score_parser_edit = reqparse.RequestParser()
score_parser_edit.add_argument("score", type=int, default=sentinel, location="json")


@api.route("/")
@api.param("competition_id, team_id")
class QuestionScoreList(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, team_id):
        """ Gets all question answers that the specified team has given. """

        items = dbc.get.question_score_list(competition_id, team_id)
        return list_response(list_schema.dump(items))


@api.route("/<question_id>")
@api.param("competition_id, team_id, question_id")
class QuestionScores(Resource):
    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def get(self, competition_id, team_id, question_id):
        """ Gets the specified question answer. """

        item = dbc.get.question_score(competition_id, team_id, question_id)
        return item_response(schema.dump(item))

    @protect_route(allowed_roles=["*"], allowed_views=["*"])
    def put(self, competition_id, team_id, question_id):
        """ Add or edit specified quesiton_answer. """

        item = dbc.get.question_score(competition_id, team_id, question_id, required=False)
        if item is None:
            args = score_parser_add.parse_args(strict=True)
            item = dbc.add.question_score(args.get("score"), question_id, team_id)
        else:
            args = score_parser_edit.parse_args(strict=True)
            item = dbc.edit.default(item, **args)

        return item_response(schema.dump(item))
