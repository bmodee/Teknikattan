import app.core.models as models
from app.core import ma
from marshmallow_sqlalchemy import fields


class BaseSchema(ma.SQLAlchemySchema):
    class Meta:
        strict = True
        load_instance = False
        include_relationships = False


class QuestionTypeSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.QuestionType

    id = ma.auto_field()
    name = ma.auto_field()


class MediaTypeSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.MediaType

    id = ma.auto_field()
    name = ma.auto_field()


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


class TeamSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = models.Team

    id = ma.auto_field()
    name = ma.auto_field()
    competition_id = ma.auto_field()
