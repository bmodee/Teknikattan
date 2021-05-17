import json

import app.core.http_codes as codes
import app.database.controller as dbc
from app.core import db
from app.database.models import City, Code, Role, Slide


def add_default_values():
    media_types = ["Image", "Video"]
    question_types = ["Boolean", "Multiple", "Text"]
    component_types = ["Text", "Image"]
    view_types = ["Team", "Judge", "Audience", "Operator"]

    roles = ["Admin", "Editor"]
    cities = ["Linköping", "Testköping"]

    for name in media_types:
        dbc.add.mediaType(name)

    for name in question_types:
        dbc.add.questionType(name)

    for name in component_types:
        dbc.add.componentType(name)

    for name in view_types:
        dbc.add.viewType(name)

    for name in roles:
        dbc.add.role(name)

    for name in cities:
        dbc.add.city(name)

    item_admin = Role.query.filter(Role.name == "Admin").one()
    item_city = City.query.filter(City.name == "Linköping").one()
    # Add user with role and city
    dbc.add.user("test@test.se", "password", item_admin.id, item_city.id, "Olle Olsson")

    # Add competitions
    item_competition = dbc.add.competition("Tom tävling", 2012, item_city.id)

    item_question = dbc.add.question("hej", 5, 1, item_competition.slides[0].id)

    item_team1 = dbc.add.team("Hej lag 3", item_competition.id)
    item_team2 = dbc.add.team("Hej lag 4", item_competition.id)

    db.session.add(Code("111111", 1, item_competition.id, item_team1.id))  # Team
    db.session.add(Code("222222", 2, item_competition.id))  # Judge

    # dbc.add.question_answer("hej", 5, item_question.id, item_team1.id)
    # dbc.add.question_answer("då", 5, item_question.id, item_team2.id)

    db.session.commit()

    for j in range(2):
        item_comp = dbc.add.competition(f"Tävling {j}", 2012, item_city.id)
        # Add two more slides to competition
        dbc.add.slide(item_comp.id)
        dbc.add.slide(item_comp.id)

        # Add slides
        for i, item_slide in enumerate(item_comp.slides):
            # Populate slide with data
            item_slide.title = f"Title {i+1}"
            item_slide.body = f"Body {i+1}"
            item_slide.timer = 100 + i + 1
            # item_slide.settings = "{}"
            dbc.utils.commit_and_refresh(item_slide)

            # Add question to competition
            # dbc.add.question(name=f"Q{i+1}", total_score=i + 1, type_id=1, slide_id=item_slide.id)

            # Add text component
            dbc.add.component(1, item_slide.id, 1, i, 2 * i, 3 * i, 4 * i, text="Text")


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
def change_order_test(client, cid, slide_id, new_slide_id, h):
    response, new_order_body = get(client, f"/api/competitions/{cid}/slides/{new_slide_id}", headers=h)
    assert response.status_code == codes.OK
    response, order_body = get(client, f"/api/competitions/{cid}/slides/{slide_id}", headers=h)
    assert response.status_code == codes.OK

    new_order = new_order_body["order"]

    # Changes order
    response, _ = put(client, f"/api/competitions/{cid}/slides/{slide_id}/order", {"order": new_order}, headers=h)
    assert response.status_code == codes.OK


def assert_slide_order(item_comp, correct_order):
    """
    Assert that the slides in the given competition are in the correct order
    """
    for slide, order in zip(item_comp.slides, correct_order):
        assert slide.order == order


def assert_all_slide_orders():
    """ Checks that all slides are in order. """

    # Get slides in competition order and slide order
    item_slides = Slide.query.order_by(Slide.competition_id).order_by(Slide.order).all()

    order = 0
    competition_id = 1
    for item_slide in item_slides:
        if item_slide.competition_id != competition_id:
            order = 0
            competition_id = item_slide.competition_id

        assert item_slide.order == order
        order += 1


def assert_should_fail(func, *args):
    """ Runs the function which should raise an exception. """

    try:
        func(*args)
    except:
        pass  # Assert failed, as it should
    else:
        assert False  # Assertion didn't fail
