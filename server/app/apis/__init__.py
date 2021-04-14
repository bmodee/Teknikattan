from functools import wraps

import app.core.http_codes as codes
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.utils import get_jwt_claims
from flask_restx.errors import abort


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_claims()
            if claims["role"] == "Admin":
                return fn(*args, **kwargs)
            else:
                return {"message:": "Admins only"}, codes.FORBIDDEN

        return decorator

    return wrapper


def text_response(message, code=codes.OK):
    return {"message": message}, codes.OK


def list_response(items, total=None, code=codes.OK):
    if type(items) is not list:
        abort(codes.INTERNAL_SERVER_ERROR)
    if not total:
        total = len(items)
    return {"items": items, "count": len(items), "total_count": total}, code


def item_response(item, code=codes.OK):
    if isinstance(item, list):
        abort(codes.INTERNAL_SERVER_ERROR)
    return item, code


from flask_restx import Api

from .auth import api as auth_ns
from .competitions import api as comp_ns
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
flask_api.add_namespace(question_ns, path="/api/competitions/<CID>/questions")
# flask_api.add_namespace(question_ns, path="/api/competitions/<CID>/slides/<SID>/question")
