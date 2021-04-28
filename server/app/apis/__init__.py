from functools import wraps

import app.core.http_codes as http_codes
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.utils import get_jwt_claims
from flask_restx.errors import abort


def validate_editor(db_item, *views):
    claims = get_jwt_claims()
    city_id = int(claims.get("city_id"))
    if db_item.city_id != city_id:
        abort(http_codes.UNAUTHORIZED)


def _is_allowed(allowed, actual):
    return actual and "*" in allowed or actual in allowed


def _has_access(in_claim, in_route):
    in_route = int(in_route) if in_route else None
    return not in_route or in_claim and in_claim == in_route


def protect_route(allowed_roles=None, allowed_views=None):
    def wrapper(func):
        def inner(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_claims()

            # Authorize request if roles has access to the route #

            nonlocal allowed_roles
            allowed_roles = allowed_roles or []
            role = claims.get("role")
            if _is_allowed(allowed_roles, role):
                return func(*args, **kwargs)

            # Authorize request if view has access and is trying to access the
            # competition its in. Also check team if client is a team.
            # Allow request if route doesn't belong to any competition.

            nonlocal allowed_views
            allowed_views = allowed_views or []
            view = claims.get("view")
            if not _is_allowed(allowed_views, view):
                abort(
                    http_codes.UNAUTHORIZED,
                    f"Client with view '{view}' is not allowed to access route with allowed views {allowed_views}.",
                )

            claim_competition_id = claims.get("competition_id")
            route_competition_id = kwargs.get("competition_id")
            if not _has_access(claim_competition_id, route_competition_id):
                abort(
                    http_codes.UNAUTHORIZED,
                    f"Client in competition '{claim_competition_id}' is not allowed to access competition '{route_competition_id}'.",
                )

            if view == "Team":
                claim_team_id = claims.get("team_id")
                route_team_id = kwargs.get("team_id")
                if not _has_access(claim_team_id, route_team_id):
                    abort(
                        http_codes.UNAUTHORIZED,
                        f"Client in team '{claim_team_id}' is not allowed to access team '{route_team_id}'.",
                    )

            return func(*args, **kwargs)

        return inner

    return wrapper


def text_response(message, code=http_codes.OK):
    return {"message": message}, code


def list_response(items, total=None, code=http_codes.OK):
    if type(items) is not list:
        abort(http_codes.INTERNAL_SERVER_ERROR)
    if not total:
        total = len(items)
    return {"items": items, "count": len(items), "total_count": total}, code


def item_response(item, code=http_codes.OK):
    if isinstance(item, list):
        abort(http_codes.INTERNAL_SERVER_ERROR)
    return item, code


from flask_restx import Api

from .alternatives import api as alternative_ns
from .answers import api as answer_ns
from .auth import api as auth_ns
from .codes import api as code_ns
from .competitions import api as comp_ns
from .components import api as component_ns
from .media import api as media_ns
from .misc import api as misc_ns
from .questions import api as question_ns
from .slides import api as slide_ns
from .teams import api as team_ns
from .users import api as user_ns

flask_api = Api()
flask_api.add_namespace(media_ns, path="/api/media")
flask_api.add_namespace(misc_ns, path="/api/misc")
flask_api.add_namespace(user_ns, path="/api/users")
flask_api.add_namespace(auth_ns, path="/api/auth")
flask_api.add_namespace(comp_ns, path="/api/competitions")
flask_api.add_namespace(slide_ns, path="/api/competitions/<competition_id>/slides")
flask_api.add_namespace(
    alternative_ns, path="/api/competitions/<competition_id>/slides/<slide_id>/questions/<question_id>/alternatives"
)
flask_api.add_namespace(answer_ns, path="/api/competitions/<competition_id>/teams/<team_id>/answers")
flask_api.add_namespace(team_ns, path="/api/competitions/<competition_id>/teams")
flask_api.add_namespace(code_ns, path="/api/competitions/<competition_id>/codes")
flask_api.add_namespace(question_ns, path="/api/competitions/<competition_id>")
flask_api.add_namespace(component_ns, path="/api/competitions/<competition_id>/slides/<slide_id>/components")
