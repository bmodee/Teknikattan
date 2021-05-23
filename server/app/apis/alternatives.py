"""
All API calls concerning question alternatives.
Default route: /api/competitions/<competition_id>/slides/<slide_id>/questions/<question_id>/alternatives
"""


import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, QuestionAlternativeSchema
from app.database import models
from app.database.models import Question, QuestionAlternative
from flask.views import MethodView
from flask_smorest import abort
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "alternative",
    "alternative",
    url_prefix="/api/competitions/<competition_id>/slides/<slide_id>/questions/<question_id>/alternatives",
    description="Adding, updating, deleting and copy alternatives",
)


class AlternativeAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionAlternative

    alternative = ma.auto_field(required=False, missing="")
    correct = ma.auto_field(required=False, missing="")


class AlternativeEditArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionAlternative

    alternative = ma.auto_field(required=False)
    alternative_order = ma.auto_field(required=False, missing=None)
    correct = ma.auto_field(required=False)
    correct_order = ma.auto_field(required=False, missing=None)


@blp.route("")
class Alternatives(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, QuestionAlternativeSchema(many=True))
    def get(self, competition_id, slide_id, question_id):
        """ Gets the all question alternatives to the specified question. """
        return dbc.get.question_alternative_list(competition_id, slide_id, question_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(AlternativeAddArgsSchema)
    @blp.response(http_codes.OK, QuestionAlternativeSchema)
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not add alternative")
    def post(self, args, competition_id, slide_id, question_id):
        """
        Posts a new question alternative to the specified
        question using the provided arguments.
        """
        return dbc.add.question_alternative(**args, question_id=question_id)


@blp.route("/<alternative_id>")
class QuestionAlternatives(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, QuestionAlternativeSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find alternative")
    def get(self, competition_id, slide_id, question_id, alternative_id):
        """ Gets the specified question alternative. """
        return dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(AlternativeEditArgsSchema)
    @blp.response(http_codes.OK, QuestionAlternativeSchema)
    @blp.alt_response(
        http_codes.BAD_REQUEST, ErrorSchema, description="Paramters to edit alternative with is incorrect"
    )
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find alternative")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not edit alternative with the given values")
    def put(self, args, competition_id, slide_id, question_id, alternative_id):
        """
        Edits the specified question alternative using the provided arguments.
        """

        item = dbc.get.question_alternative(
            competition_id,
            slide_id,
            question_id,
            alternative_id,
        )

        new_alternative_order = args.pop("alternative_order")
        if new_alternative_order is not None and item.alternative_order != new_alternative_order:
            if not (0 <= new_alternative_order < dbc.utils.count(QuestionAlternative, {"question_id": question_id})):
                abort(
                    http_codes.BAD_REQUEST,
                    message=f"Kan inte ändra till ogiltigt sidordning '{new_alternative_order}'",
                )

            item_question = dbc.get.one(Question, question_id)
            dbc.utils.move_order(
                item_question.alternatives, "alternative_order", item.alternative_order, new_alternative_order
            )

        new_correct_order = args.pop("correct_order")
        if new_correct_order is not None and item.correct_order != new_correct_order:
            if not (0 <= new_correct_order < dbc.utils.count(QuestionAlternative, {"question_id": question_id})):
                abort(http_codes.BAD_REQUEST, message=f"Kan inte ändra till ogiltigt sidordning '{new_correct_order}'")

            item_question = dbc.get.one(Question, question_id)
            dbc.utils.move_order(item_question.alternatives, "correct_order", item.correct_order, new_correct_order)

        return dbc.edit.default(item, **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find alternative")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not delete alternative")
    def delete(self, competition_id, slide_id, question_id, alternative_id):
        """ Deletes the specified question alternative. """
        dbc.delete.default(dbc.get.question_alternative(competition_id, slide_id, question_id, alternative_id))
        return None
