import app.core.models as models
import app.core.schemas as schemas
from app.core import ma
from marshmallow import fields as fields2
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


class CompetitionSchemaRich(RichSchema):
    class Meta(RichSchema.Meta):
        model = models.Competition

    id = ma.auto_field()
    name = ma.auto_field()
    year = ma.auto_field()
    slides = fields.Nested(schemas.SlideSchema, many=True)
    city = fields.Nested(schemas.CitySchema, many=False)


class UserListSchema(ma.Schema):
    users = fields2.Nested(UserSchemaRich, many=False)
