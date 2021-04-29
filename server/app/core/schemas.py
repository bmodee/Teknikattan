"""
This module contains schemas used to convert database objects into 
dictionaries.
"""

import app.database.models as models
from app.core import ma
from marshmallow_sqlalchemy import fields


class BaseSchema(ma.SQLAlchemySchema):
    class Meta:
        strict = True
        load_instance = False
        include_relationships = False


class IdNameSchema(BaseSchema):

    id = fields.fields.Integer()
    name = fields.fields.String()


class QuestionTypeSchema(IdNameSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionType


class MediaTypeSchema(IdNameSchema):
    class Meta(BaseSchema.Meta):
        model = models.MediaType


class ComponentTypeSchema(IdNameSchema):
    class Meta(BaseSchema.Meta):
        model = models.ComponentType


class CodeSchema(IdNameSchema):
    class Meta(BaseSchema.Meta):
        model = models.Code

    id = ma.auto_field()
    code = ma.auto_field()
    view_type_id = ma.auto_field()
    competition_id = fields.fields.Integer()
    team_id = fields.fields.Integer()


class ViewTypeSchema(IdNameSchema):
    class Meta(BaseSchema.Meta):
        model = models.ViewType


class QuestionSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Question

    id = ma.auto_field()
    name = ma.auto_field()
    total_score = ma.auto_field()
    type_id = ma.auto_field()
    slide_id = ma.auto_field()
    correcting_instructions = ma.auto_field()


class QuestionAnswerSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionAnswer

    id = ma.auto_field()
    answer = ma.auto_field()
    score = ma.auto_field()
    question_id = ma.auto_field()
    team_id = ma.auto_field()


class QuestionAlternativeSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionAlternative

    id = ma.auto_field()
    text = ma.auto_field()
    value = ma.auto_field()
    question_id = ma.auto_field()


class RoleSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Role

    id = ma.auto_field()
    name = ma.auto_field()


class CitySchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.City

    id = ma.auto_field()
    name = ma.auto_field()


class MediaSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Media

    id = ma.auto_field()
    filename = ma.auto_field()
    type_id = ma.auto_field()
    upload_by_id = ma.auto_field()


class SlideSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Slide

    id = ma.auto_field()
    order = ma.auto_field()
    title = ma.auto_field()
    timer = ma.auto_field()
    competition_id = ma.auto_field()
    background_image = fields.Nested(MediaSchema, many=False)


class TeamSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Team

    id = ma.auto_field()
    name = ma.auto_field()
    competition_id = ma.auto_field()


class UserSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.User

    id = ma.auto_field()
    name = ma.auto_field()
    email = ma.auto_field()
    role_id = ma.auto_field()
    city_id = ma.auto_field()


class CompetitionSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Competition

    id = ma.auto_field()
    name = ma.auto_field()
    year = ma.auto_field()
    city_id = ma.auto_field()
    background_image = fields.Nested(MediaSchema, many=False)


class ComponentSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Component

    id = ma.auto_field()
    x = ma.auto_field()
    y = ma.auto_field()
    w = ma.auto_field()
    h = ma.auto_field()
    slide_id = ma.auto_field()
    type_id = ma.auto_field()
    view_type_id = ma.auto_field()

    text = fields.fields.String()
    media = fields.Nested(MediaSchema, many=False)
    question_id = fields.fields.Integer()