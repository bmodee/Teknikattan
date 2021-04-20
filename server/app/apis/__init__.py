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


def check_jwt(editor=False, *views):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_claims()
            role = claims.get("role")
            view = claims.get("view")
            if role == "Admin":
                return fn(*args, **kwargs)
            elif editor and role == "Editor":
                return fn(*args, **kwargs)
            elif view in views:
                return fn(*args, **kwargs)
            else:
                abort(http_codes.UNAUTHORIZED)

        return decorator

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
flask_api.add_namespace(slide_ns, path="/api/competitions/<CID>/slides")
flask_api.add_namespace(team_ns, path="/api/competitions/<CID>/teams")
flask_api.add_namespace(code_ns, path="/api/competitions/<CID>/codes")
flask_api.add_namespace(question_ns, path="/api/competitions/<CID>")
flask_api.add_namespace(component_ns, path="/api/competitions/<CID>/slides/<SOrder>/components")
