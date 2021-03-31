from app.apis import slides
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
    slide_model = api.model(
        "Slide",
        {
            "id": fields.Integer(),
            "competition_id": fields.Integer(),
            "order": fields.Integer(),
        },
    )

    team_model = api.model(
        "Team", {"id": fields.Integer(), "name": fields.String(), "competition_id": fields.Integer()}
    )
