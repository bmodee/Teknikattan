"""
All API calls concerning competitions.
Default route: /api/competitions/<competition_id>/slides/<slide_id>/components
"""

import app.database.controller as dbc
from app.core.schemas import BaseSchema, ComponentSchema
from flask.views import MethodView
from flask_smorest.error_handler import ErrorSchema
from marshmallow import fields

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "component",
    "component",
    url_prefix="/api/competitions/<competition_id>/slides/<slide_id>/components",
    description="Adding, updating, deleting and copy components",
)


class ComponentAddArgsSchema(BaseSchema):

    x = fields.Integer(required=False, missing=0)
    y = fields.Integer(required=False, missing=0)
    w = fields.Integer(required=False, missing=1)
    h = fields.Integer(required=False, missing=1)

    type_id = fields.Integer(required=True)
    view_type_id = fields.Integer(required=True)

    text = fields.String(required=False)
    media_id = fields.Integer(required=False)
    question_id = fields.Integer(required=False)


class ComponentEditArgsSchema(BaseSchema):

    x = fields.Integer(required=False)
    y = fields.Integer(required=False)
    w = fields.Integer(required=False)
    h = fields.Integer(required=False)

    type_id = fields.Integer(required=False)
    view_type_id = fields.Integer(required=False)

    text = fields.String(required=False)
    media_id = fields.Integer(required=False)
    question_id = fields.Integer(required=False)


@blp.route("")
class Components(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, ComponentSchema(many=True))
    def get(self, competition_id, slide_id):
        """ Gets all components in the specified slide and competition. """
        return dbc.get.component_list(competition_id, slide_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(ComponentAddArgsSchema)
    @blp.response(http_codes.OK, ComponentSchema)
    def post(self, args, competition_id, slide_id):
        """ Posts a new component to the specified slide. """
        return dbc.add.component(slide_id=slide_id, **args)


@blp.route("/<component_id>")
class ComponentById(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=ALL)
    @blp.response(http_codes.OK, ComponentSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find component")
    def get(self, competition_id, slide_id, component_id):
        """ Gets the specified component. """
        return dbc.get.component(competition_id, slide_id, component_id)

    @blp.authorization(allowed_roles=ALL)
    @blp.arguments(ComponentEditArgsSchema)
    @blp.response(http_codes.OK, ComponentSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find component")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not update component with given values")
    def put(self, args, competition_id, slide_id, component_id):
        """ Edits the specified component using the provided arguments. """
        return dbc.edit.default(dbc.get.component(competition_id, slide_id, component_id), **args)

    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.NO_CONTENT, None)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Could not find component")
    @blp.alt_response(http_codes.CONFLICT, ErrorSchema, description="Could not delete component")
    def delete(self, competition_id, slide_id, component_id):
        """ Deletes the specified component. """
        dbc.delete.component(dbc.get.component(competition_id, slide_id, component_id))
        return None


@blp.route("/<component_id>/copy/<view_type_id>")
class ComponentCopy(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, ComponentSchema)
    def post(self, competition_id, slide_id, component_id, view_type_id):
        """ Creates a deep copy of the specified component. """
        return dbc.copy.component(dbc.get.component(competition_id, slide_id, component_id), slide_id, view_type_id)
