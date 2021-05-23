"""
All API calls concerning question answers.
Default route: /api/competitions/<competition_id>/teams/<team_id>/answers
"""

import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, QuestionAlternativeAnswerSchema
from app.database import models
from flask.views import MethodView

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "answer",
    "answer",
    url_prefix="/api/competitions/<competition_id>/teams/<team_id>/answers",
    description="Adding, updating, deleting and copy answer",
)


class AnswerAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionAlternativeAnswer

    answer = ma.auto_field(required=False)


@blp.route("")
class QuestionAlternativeList(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, QuestionAlternativeAnswerSchema)
    def get(self, competition_id, team_id):
        """ Gets all question answers that the specified team has given. """
        return dbc.get.question_alternative_answer_list(competition_id, team_id)


@blp.route("/<answer_id>")
class QuestionAlternativeAnswers(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, QuestionAlternativeAnswerSchema)
    def get(self, competition_id, team_id, answer_id):
        """ Gets the specified question answer. """
        return dbc.get.question_alternative_answer(competition_id, team_id, answer_id)

    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.arguments(AnswerAddArgsSchema)
    @blp.response(http_codes.OK, QuestionAlternativeAnswerSchema)
    def put(self, args, competition_id, team_id, answer_id):
        """ Add or edit specified quesiton_answer. """

        item = dbc.get.question_alternative_answer(competition_id, team_id, answer_id, required=False)
        if item is None:
            item = dbc.add.question_alternative_answer(args.get("answer"), answer_id, team_id)
        else:
            item = dbc.edit.default(item, **args)

        return item
