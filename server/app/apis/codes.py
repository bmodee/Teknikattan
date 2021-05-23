"""
All API calls concerning competition codes.
Default route: /api/competitions/<competition_id>/codes
"""

import app.database.controller as dbc
from app.core.schemas import CodeSchema
from app.database.models import Code
from flask.views import MethodView
from flask_smorest.error_handler import ErrorSchema

from . import ALL, ExtendedBlueprint, http_codes

blp = ExtendedBlueprint(
    "code", "code", url_prefix="/api/competitions/<competition_id>/codes", description="Operations on codes"
)


@blp.route("")
class CodesList(MethodView):
    @blp.authorization(allowed_roles=ALL, allowed_views=["Operator"])
    @blp.response(http_codes.OK, CodeSchema(many=True))
    def get(self, competition_id):
        """ Gets the all competition codes. """
        return dbc.get.code_list(competition_id)


@blp.route("/<code_id>")
class CodesById(MethodView):
    @blp.authorization(allowed_roles=ALL)
    @blp.response(http_codes.OK, CodeSchema)
    @blp.alt_response(http_codes.NOT_FOUND, ErrorSchema, description="Code not found")
    def put(self, competition_id, code_id):
        """ Generates a new competition code. """
        return dbc.edit.default(dbc.get.one(Code, code_id), code=dbc.utils.generate_unique_code())
