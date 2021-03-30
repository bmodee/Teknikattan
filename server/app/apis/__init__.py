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

from .auth import api as ns2
from .competitions import api as ns4
from .slides import api as ns3
from .users import api as ns1

flask_api = Api()
flask_api.add_namespace(ns1, path="/api/users")
flask_api.add_namespace(ns3, path="/api/slides")
flask_api.add_namespace(ns2, path="/api/auth")
flask_api.add_namespace(ns4, path="/api/competitions")
