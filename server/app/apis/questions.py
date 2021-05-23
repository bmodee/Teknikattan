"""
All API calls concerning question answers.
Default route: /api/competitions/<competition_id>
"""

import app.database.controller as dbc
from app.core import ma
from app.core.schemas import BaseSchema, QuestionSchema
from app.database import models
from flask.views import MethodView
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "question",
    "question",
    url_prefix="/api/competitions/<competition_id>/slides/<slide_id>/questions",
    description="Adding, updating and deleting questions",
)


class QuestionAddArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Question

    name = ma.auto_field(required=False, missing="")
    total_score = ma.auto_field(required=False, missing=None)
    type_id = ma.auto_field(required=True)
    correcting_instructions = ma.auto_field(required=False, missing=None)


class QuestionEditArgsSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Question

    name = ma.auto_field(required=False)
    total_score = ma.auto_field(required=False)
    type_id = ma.auto_field(required=False)
    correcting_instructions = ma.auto_field(required=False)


@blp.route("")
class Questions(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, QuestionSchema(many=True))
    def get(self, competition_id, slide_id):
        """ Gets all questions in the specified competition and slide. """
        return dbc.get.question_list(competition_id, slide_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(QuestionAddArgsSchema)
    @blp.response(http_codes.OK, QuestionSchema)
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not add question")
    def post(self, args, competition_id, slide_id):
        """ Posts a new question to the specified slide using the provided arguments. """
        return dbc.add.question(slide_id=slide_id, **args)


@blp.route("/<question_id>")
class QuestionById(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, QuestionSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find question")
    def get(self, competition_id, slide_id, question_id):
        """
        Gets the specified question using the specified competition and slide.
        """
        return dbc.get.question(competition_id, slide_id, question_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(QuestionEditArgsSchema)
    @blp.response(http_codes.OK, QuestionSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find question")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not edit question")
    def put(self, args, competition_id, slide_id, question_id):
        """ Edits the specified question with the provided arguments. """
        return dbc.edit.default(dbc.get.question(competition_id, slide_id, question_id), **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find question")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not delete question")
    def delete(self, competition_id, slide_id, question_id):
        """ Deletes the specified question. """
        dbc.delete.question(dbc.get.question(competition_id, slide_id, question_id))
        return None
