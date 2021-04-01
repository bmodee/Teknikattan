from functools import wraps

from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.utils import get_jwt_claims


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_claims()
            if claims["role"] == "Admin":
                return fn(*args, **kwargs)
            else:
                return {"message:": "Admins only"}, 403

        return decorator

    return wrapper


def text_response(text, code=200):
    return {"message": text}, code


def query_response(db_items, code=200):
    if type(db_items) is not list:
        db_items = [db_items]
    return {"result": [i.get_dict() for i in db_items]}, code


def object_response(items, code=200):
    if type(items) is not list:
        items = [items]
    return {"result": items}, code


from flask_restx import Api

from .auth import api as auth_ns
from .competitions import api as comp_ns
from .misc import api as misc_ns
from .slides import api as slide_ns
from .teams import api as team_ns
from .users import api as user_ns

flask_api = Api()
flask_api.add_namespace(misc_ns, path="/api/misc")
flask_api.add_namespace(user_ns, path="/api/users")
flask_api.add_namespace(auth_ns, path="/api/auth")
flask_api.add_namespace(comp_ns, path="/api/competitions")
flask_api.add_namespace(slide_ns, path="/api/competitions/<CID>/slides")
flask_api.add_namespace(team_ns, path="/api/competitions/<CID>/teams")
