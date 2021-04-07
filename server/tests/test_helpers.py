import json

import app.core.controller as dbc
from app.core import db
from app.core.models import City, MediaType, QuestionType, Role, User


def add_default_values():
    media_types = ["Image", "Video"]
    question_types = ["Boolean", "Multiple", "Text"]
    roles = ["Admin", "Editor"]
    cities = ["Linköping"]

    # Add media types
    for item in media_types:
        dbc.add.mediaType(item)

    # Add question types
    for item in question_types:
        dbc.add.questionType(item)

    # Add roles
    for item in roles:
        dbc.add.role(item)
    # Add cities
    for item in cities:
        dbc.add.city(item)

    item_admin = Role.query.filter(Role.name == "Admin").one()
    item_city = City.query.filter(City.name == "Linköping").one()
    # Add user with role and city
    dbc.add.user("test@test.se", "password", item_admin.id, item_city.id)


def get_body(response):
    try:
        body = json.loads(response.data.decode())
    except:
        body = None
    return body


def post(client, url, data, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    response = client.post(url, data=json.dumps(data), headers=headers)
    body = get_body(response)
    return response, body


def get(client, url, query_string=None, headers=None):
    response = client.get(url, query_string=query_string, headers=headers)
    body = get_body(response)
    return response, body


def put(client, url, data, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"

    response = client.put(url, data=json.dumps(data), headers=headers)
    body = get_body(response)
    return response, body


def delete(client, url, data, headers=None):
    response = client.delete(url, data=json.dumps(data), headers=headers)
    body = get_body(response)
    return response, body


# Try insert invalid row. If it fails then the test is passed
def assert_insert_fail(db_type, *args):
    try:
        db.session.add(db_type(*args))
        db.session.commit()
        assert False
    except:
        db.session.rollback()


def assert_exists(db_type, length, **kwargs):
    items = db_type.query.filter_by(**kwargs).all()
    assert len(items) == length
    return items[0]


def assert_object_values(obj, values):
    for k, v in values.items():
        assert getattr(obj, k) == v
