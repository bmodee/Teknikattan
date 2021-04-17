import app.core.http_codes as codes
from app.core import db
from app.database.controller import utils
from app.database.models import (
    Blacklist,
    City,
    Code,
    Competition,
    Component,
    ComponentType,
    Media,
    MediaType,
    Question,
    QuestionType,
    Role,
    Slide,
    Team,
    User,
    ViewType,
)
from flask_restx import abort


def db_add(item):
    db.session.add(item)
    db.session.commit()
    db.session.refresh(item)

    if not item:
        abort(codes.BAD_REQUEST, f"Object could not be created")

    return item


def blacklist(jti):
    return db_add(Blacklist(jti))


def mediaType(name):
    return db_add(MediaType(name))


def questionType(name):
    return db_add(QuestionType(name))


def componentType(name):
    return db_add(ComponentType(name))


def viewType(name):
    return db_add(ViewType(name))


def role(name):
    return db_add(Role(name))


def city(name):
    return db_add(City(name))


def component(type_id, item_slide, data, x=0, y=0, w=0, h=0):
    return db_add(Component(item_slide.id, type_id, data, x, y, w, h))


def image(filename, user_id):
    return db_add(Media(filename, 1, user_id))


def user(email, password, role_id, city_id, name=None):
    return db_add(User(email, password, role_id, city_id, name))


def question(name, total_score, type_id, item_slide):
    return db_add(Question(name, total_score, type_id, item_slide.id))


def code(pointer, view_type_id):
    code_string = utils.generate_unique_code()
    return db_add(Code(code_string, pointer, view_type_id))


def team(name, item_competition):
    item = db_add(Team(name, item_competition.id))

    # Add code for the team
    code(item.id, 1)

    return item


def slide(item_competition):
    order = Slide.query.filter(Slide.competition_id == item_competition.id).count()  # first element has index 0
    return db_add(Slide(order, item_competition.id))


def competition(name, year, city_id):
    item_competition = db_add(Competition(name, year, city_id))

    # Add one slide for the competition
    slide(item_competition)

    # Add code for Judge view
    code(item_competition.id, 2)

    # Add code for Audience view
    code(item_competition.id, 3)

    # Add two teams

    utils.refresh(item_competition)
    return item_competition
