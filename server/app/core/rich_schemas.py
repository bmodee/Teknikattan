import app.core.schemas as schemas
import app.database.models as models
from app.core import ma
from marshmallow_sqlalchemy import fields


class RichSchema(ma.SQLAlchemySchema):
    class Meta:
        strict = True
        load_instance = True
        include_relationships = True


class UserSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.User

    id = ma.auto_field()
    name = ma.auto_field()
    email = ma.auto_field()
    role = fields.Nested(schemas.RoleSchema, many=False)
    city = fields.Nested(schemas.CitySchema, many=False)


class QuestionSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Question

    id = ma.auto_field()
    name = ma.auto_field()
    total_score = ma.auto_field()
    slide_id = ma.auto_field()
    type = fields.Nested(schemas.QuestionTypeSchema, many=False)


class TeamSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Team

    id = ma.auto_field()
    name = ma.auto_field()
    competition_id = ma.auto_field()
    question_answers = fields.Nested(schemas.QuestionAnswerSchema, many=True)


class SlideSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Slide

    id = ma.auto_field()
    order = ma.auto_field()
    title = ma.auto_field()
    timer = ma.auto_field()
    competition_id = ma.auto_field()
    questions = fields.Nested(QuestionSchemaRich, many=True)


class CompetitionSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Competition

    id = ma.auto_field()
    name = ma.auto_field()
    year = ma.auto_field()
    city = fields.Nested(schemas.CitySchema, many=False)
    slides = fields.Nested(
        SlideSchemaRich,
        many=True,
    )
    teams = fields.Nested(TeamSchemaRich, many=True)
