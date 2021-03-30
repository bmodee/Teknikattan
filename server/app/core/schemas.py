from flask_restx import Namespace, Resource, abort, fields, inputs, model, reqparse

user_schema = (
    "User",
    {
        "id": fields.Integer(),
        "name": fields.String(),
        "email": fields.String(),
        "role": fields.String(attribute=lambda x: x.role.name),
        "city": fields.String(attribute=lambda x: x.city.name),
    },
)

competition_schema = (
    "Competition",
    {
        "id": fields.Integer(),
        "name": fields.String(),
        "year": fields.Integer(),
        "style_id": fields.Integer(),
        "city_id": fields.Integer(),
    },
)
