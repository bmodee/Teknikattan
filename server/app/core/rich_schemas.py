"""
This module contains rich schemas used to convert database objects into 
dictionaries. This is the rich variant which means that objects will 
pull in other whole objects instead of just the id.
"""
import app.core.schemas as schemas
import app.database.models as models
from app.core import ma
from marshmallow_sqlalchemy import fields


class RichSchema(ma.SQLAlchemySchema):
    class Meta:
        strict = True
        load_instance = True
        include_relationships = True


class QuestionSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Question

    id = ma.auto_field()
    name = ma.auto_field()
    total_score = ma.auto_field()
    slide_id = ma.auto_field()
    type_id = ma.auto_field()
    correcting_instructions = ma.auto_field()
    alternatives = fields.Nested(schemas.QuestionAlternativeSchema, many=True)


class TeamSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Team

    id = ma.auto_field()
    name = ma.auto_field()
    competition_id = ma.auto_field()
    question_alternative_answers = fields.Nested(schemas.QuestionAlternativeAnswerSchema, many=True)
    question_scores = fields.Nested(schemas.QuestionScoreSchema, many=True)


class SlideSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Slide

    id = ma.auto_field()
    order = ma.auto_field()
    title = ma.auto_field()
    timer = ma.auto_field()
    competition_id = ma.auto_field()
    background_image = fields.Nested(schemas.MediaSchema, many=False)
    questions = fields.Nested(QuestionSchemaRich, many=True)
    components = fields.Nested(schemas.ComponentSchema, many=True)


class CompetitionSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Competition

    id = ma.auto_field()
    name = ma.auto_field()
    year = ma.auto_field()
    city_id = ma.auto_field()
    background_image = fields.Nested(schemas.MediaSchema, many=False)

    slides = fields.Nested(
        SlideSchemaRich,
        many=True,
    )
    teams = fields.Nested(TeamSchemaRich, many=True)
