from functools import wraps

from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.utils import get_jwt
from flask_smorest import Blueprint, abort
from flask_smorest.error_handler import ErrorSchema

Blueprint.PAGINATION_HEADER_FIELD_NAME = "pagination"


ALL = ["*"]


class http_codes:
    OK = 200
    NO_CONTENT = 204
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    CONFLICT = 409
    GONE = 410
    INTERNAL_SERVER_ERROR = 500
    SERVICE_UNAVAILABLE = 503


def _is_allowed(allowed, actual):
    return actual and allowed == ALL or actual in allowed


def _has_access(in_claim, in_route):
    in_route = int(in_route) if in_route else None
    return not in_route or in_claim and in_claim == in_route


# class AuthorizationHeadersSchema(Schema):

#     Authorization = fields.String(required=True)


class ExtendedBlueprint(Blueprint):
    def authorization(self, allowed_roles=None, allowed_views=None):
        def decorator(func):

            # func = self.arguments(AuthorizationHeadersSchema, location="headers")(func)
            func = self.alt_response(http_codes.UNAUTHORIZED, ErrorSchema, description="Unauthorized")(func)

            @wraps(func)
            def wrapper(*args, **kwargs):

                # Check that allowed_roles and allowed_views have correct type
                nonlocal allowed_roles
                nonlocal allowed_views
                allowed_roles = allowed_roles or []
                allowed_views = allowed_views or []
                assert (
                    isinstance(allowed_roles, list) or allowed_roles == "*"
                ), f"Allowed roles must be a list or '*', not '{allowed_roles}'"
                assert (
                    isinstance(allowed_views, list) or allowed_views == "*"
                ), f"Allowed views must be a list or '*', not '{allowed_views}'"

                verify_jwt_in_request()
                jwt = get_jwt()

                # Authorize request if roles has access to the route #

                role = jwt.get("role")
                if _is_allowed(allowed_roles, role):
                    return func(*args, **kwargs)

                # Authorize request if view has access and is trying to access the
                # competition its in. Also check team if client is a team.
                # Allow request if route doesn't belong to any competition.

                view = jwt.get("view")
                if not _is_allowed(allowed_views, view):
                    abort(
                        http_codes.UNAUTHORIZED,
                        f"Client with view '{view}' is not allowed to access route with allowed views {allowed_views}.",
                    )

                claim_competition_id = jwt.get("competition_id")
                route_competition_id = kwargs.get("competition_id")
                if not _has_access(claim_competition_id, route_competition_id):
                    abort(
                        http_codes.UNAUTHORIZED,
                        f"Client in competition '{claim_competition_id}' is not allowed to access competition '{route_competition_id}'.",
                    )

                if view == "Team":
                    claim_team_id = jwt.get("team_id")
                    route_team_id = kwargs.get("team_id")
                    if not _has_access(claim_team_id, route_team_id):
                        abort(
                            http_codes.UNAUTHORIZED,
                            f"Client in team '{claim_team_id}' is not allowed to access team '{route_team_id}'.",
                        )

                return func(*args, **kwargs)

            return wrapper

        return decorator


from flask_smorest import Api

flask_api = Api()


def init_api():

    from .alternatives import blp as alternative_blp
    from .answers import blp as answer_blp
    from .auth import blp as auth_blp
    from .codes import blp as code_blp
    from .competitions import blp as competition_blp
    from .components import blp as component_blp
    from .media import blp as media_blp
    from .misc import blp as misc_blp
    from .questions import blp as question_blp
    from .scores import blp as score_blp
    from .slides import blp as slide_blp
    from .teams import blp as team_blp
    from .users import blp as user_blp

    flask_api.register_blueprint(user_blp)
    flask_api.register_blueprint(auth_blp)
    flask_api.register_blueprint(competition_blp)
    flask_api.register_blueprint(misc_blp)
    flask_api.register_blueprint(media_blp)
    flask_api.register_blueprint(slide_blp)
    flask_api.register_blueprint(question_blp)
    flask_api.register_blueprint(team_blp)
    flask_api.register_blueprint(code_blp)
    flask_api.register_blueprint(alternative_blp)
    flask_api.register_blueprint(component_blp)
    flask_api.register_blueprint(answer_blp)
    flask_api.register_blueprint(score_blp)
