from functools import wraps

from flask import Blueprint
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


api_blueprint = Blueprint("api", __name__)

# Import the rest of the routes.
from app.api import admin, users
