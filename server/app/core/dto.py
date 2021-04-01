from flask_restx import Namespace, fields


class AuthDTO:
    api = Namespace("auth")
    model = api.model("Auth", {"id": fields.Integer()})


class UserDTO:
    api = Namespace("users")
    model = api.model(
        "User",
        {
            "id": fields.Integer(),
            "name": fields.String(),
            "email": fields.String(),
            "role_id": fields.Integer(),
            "city_id": fields.Integer(),
        },
    )
    user_list_model = api.model(
        "UserList",
        {"users": fields.List(fields.Nested(model)), "count": fields.Integer(), "total": fields.Integer()},
    )


class CompetitionDTO:
    api = Namespace("competitions")
    model = api.model(
        "Competition",
        {
            "id": fields.Integer(),
            "name": fields.String(),
            "year": fields.Integer(),
            "style_id": fields.Integer(),
            "city_id": fields.Integer(),
        },
    )
    user_list_model = api.model(
        "CompetitionList",
        {"competitions": fields.List(fields.Nested(model)), "count": fields.Integer(), "total": fields.Integer()},
    )


class SlideDTO:
    api = Namespace("slides")
    model = api.model(
        "Slide",
        {
            "id": fields.Integer(),
            "order": fields.Integer(),
            "title": fields.String(),
            "timer": fields.Integer(),
            "competition_id": fields.Integer(),
        },
    )


class TeamDTO:
    api = Namespace("teams")
    model = api.model("Team", {"id": fields.Integer(), "name": fields.String(), "competition_id": fields.Integer()})


class MiscDTO:
    api = Namespace("misc")
    role_model = api.model("Role", {"id": fields.Integer(), "name": fields.String()})
    question_type_model = api.model("QuestionType", {"id": fields.Integer(), "name": fields.String()})
    media_type_model = api.model("MediaType", {"id": fields.Integer(), "name": fields.String()})
    city_model = api.model("City", {"id": fields.Integer(), "name": fields.String()})
