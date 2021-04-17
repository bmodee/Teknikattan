import app.core.rich_schemas as rich_schemas
import app.core.schemas as schemas
from flask_restx import Namespace
from flask_uploads import IMAGES, UploadSet


class ComponentDTO:
    api = Namespace("component")
    schema = schemas.ComponentSchema(many=False)
    list_schema = schemas.ComponentSchema(many=True)


class MediaDTO:
    api = Namespace("media")
    image_set = UploadSet("photos", IMAGES)
    schema = schemas.MediaSchema(many=False)
    list_schema = schemas.MediaSchema(many=True)


class AuthDTO:
    api = Namespace("auth")
    schema = rich_schemas.UserSchemaRich(many=False)
    list_schema = rich_schemas.UserSchemaRich(many=True)


class UserDTO:
    api = Namespace("users")
    schema = rich_schemas.UserSchemaRich(many=False)
    list_schema = schemas.UserSchema(many=True)


class CompetitionDTO:
    api = Namespace("competitions")
    schema = rich_schemas.CompetitionSchemaRich(many=False)
    list_schema = schemas.CompetitionSchema(many=True)


class CodeDTO:
    api = Namespace("codes")
    schema = rich_schemas.CodeSchemaRich(many=False)
    list_schema = schemas.CodeSchema(many=True)


class SlideDTO:
    api = Namespace("slides")
    schema = schemas.SlideSchema(many=False)
    list_schema = schemas.SlideSchema(many=True)


class TeamDTO:
    api = Namespace("teams")
    schema = schemas.TeamSchema(many=False)
    list_schema = schemas.TeamSchema(many=True)


class MiscDTO:
    api = Namespace("misc")
    role_schema = schemas.RoleSchema(many=True)
    question_type_schema = schemas.QuestionTypeSchema(many=True)
    media_type_schema = schemas.MediaTypeSchema(many=True)
    component_type_schema = schemas.ComponentTypeSchema(many=True)
    view_type_schema = schemas.ViewTypeSchema(many=True)
    city_schema = schemas.CitySchema(many=True)


class QuestionDTO:
    api = Namespace("questions")
    schema = rich_schemas.QuestionSchemaRich(many=False)
    list_schema = schemas.QuestionSchema(many=True)
