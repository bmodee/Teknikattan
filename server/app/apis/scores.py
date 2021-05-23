"""
All API calls concerning question score.
Default route: /api/competitions/<competition_id>/teams/<team_id>/answers/quesiton_scores
"""

import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, QuestionScoreSchema
from app.database import models
from flask.views import MethodView
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "score",
    "score",
    url_prefix="/api/competitions/<competition_id>/teams/<team_id>/scores",
    description="Operations on scores",
)


class ScoreAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionScore

    score = ma.auto_field(required=False)


@blp.route("")
class QuestionScoreList(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, QuestionScoreSchema(many=True))
    def get(self, competition_id, team_id):
        """ Gets all question answers that the specified team has given. """
        return dbc.get.question_score_list(competition_id, team_id)


@blp.route("/<question_id>")
class QuestionScores(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, QuestionScoreSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Cant find answer")
    def get(self, competition_id, team_id, question_id):
        """ Gets the score for the provided team on the provided question. """
        return dbc.get.question_score(competition_id, team_id, question_id)

    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.arguments(ScoreAddArgsSchema)
    @blp.response(http_codes.OK, QuestionScoreSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Cant find score")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Can't add or edit score with provided values")
    def put(self, args, competition_id, team_id, question_id):
        """ Add or edit specified quesiton_answer. """

        item = dbc.get.question_score(competition_id, team_id, question_id, required=False)
        if item is None:
            item = dbc.add.question_score(args.get("score"), question_id, team_id)
        else:
            item = dbc.edit.default(item, **args)

        return item
