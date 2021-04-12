import json

import app.core.controller as dbc
import app.core.http_codes as codes
from app.core import db
from app.core.models import City, Role


def add_default_values():
    media_types = ["Image", "Video"]
    question_types = ["Boolean", "Multiple", "Text"]
    roles = ["Admin", "Editor"]
    cities = ["Linköping", "Testköping"]

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
    dbc.add.user("test@test.se", "password", item_admin.id, item_city.id, "Olle Olsson")

    # Add competitions
    dbc.add.competition("Tom tävling", 2012, item_city.id)
    for j in range(2):
        item_comp = dbc.add.competition(f"Tävling {j}", 2012, item_city.id)

        # Add slides
        for i in range(len(question_types)):
            # Add slide to competition
            item_slide = dbc.add.slide(item_comp)

            # Populate slide with data
            item_slide.title = f"Title {i}"
            item_slide.body = f"Body {i}"
            item_slide.timer = 100 + i
            # item_slide.settings = "{}"

            # Add question to competition
            dbc.add.question(name=f"Q{i+1}", total_score=i + 1, type_id=i + 1, item_slide=item_slide)


def get_body(response):
    try:
        body = json.loads(response.data.decode())
    except:
        body = None
    return body


def post(client, url, data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    response = client.post(url, json=data, headers=headers)
    body = get_body(response)
    return response, body


def get(client, url, query_string=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = ""
    response = client.get(url, query_string=query_string, headers=headers)
    body = get_body(response)
    return response, body


def put(client, url, data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    response = client.put(url, json=data, headers=headers)
    body = get_body(response)
    return response, body


def delete(client, url, data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = ""
    response = client.delete(url, json=data, headers=headers)
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


# Changes order of slides
def change_order_test(client, cid, sid, order, h):
    sid_at_order = -1
    actual_order = 0 if order < 0 else order  # used to find the slide_id
    response, body = get(client, f"/api/competitions/{cid}/slides", headers=h)
    assert response.status_code == codes.OK

    # Finds the slide_id of the slide that will be swapped with
    for item_slide in body["items"]:
        if item_slide["order"] == actual_order:
            assert item_slide["id"] != sid
            sid_at_order = item_slide["id"]
    assert sid_at_order != -1

    # Gets old versions of slides
    response, item_slide_10 = get(client, f"/api/competitions/{cid}/slides/{sid}", headers=h)
    assert response.status_code == codes.OK
    response, item_slide_20 = get(client, f"/api/competitions/{cid}/slides/{sid_at_order}", headers=h)
    assert response.status_code == codes.OK

    # Changes order
    response, _ = put(
        client, f"/api/competitions/{cid}/slides/{sid}/order", {"order": order}, headers=h
    )  # uses order to be able to test negative order
    assert response.status_code == codes.OK

    # Gets new versions of slides
    response, item_slide_11 = get(client, f"/api/competitions/{cid}/slides/{sid}", headers=h)
    assert response.status_code == codes.OK
    response, item_slide_21 = get(client, f"/api/competitions/{cid}/slides/{sid_at_order}", headers=h)
    assert response.status_code == codes.OK

    # Checks that the order was indeed swapped
    assert item_slide_10["order"] == item_slide_21["order"]
    assert item_slide_11["order"] == item_slide_20["order"]
