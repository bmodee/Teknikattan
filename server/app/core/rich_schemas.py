import app.core.models as models
import app.core.schemas as schemas
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
    type = fields.Nested(schemas.QuestionTypeSchema, many=False)
    slide = fields.Nested(schemas.SlideSchema, many=False)


class CompetitionSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Competition

    id = ma.auto_field()
    name = ma.auto_field()
    year = ma.auto_field()
    slides = fields.Nested(schemas.SlideSchema, many=True)
    city = fields.Nested(schemas.CitySchema, many=False)
