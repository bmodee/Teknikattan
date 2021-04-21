"""
This file contains functionality to add data to the database.
"""

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
    """
    Internal function. Adds item to the database
    and handles comitting and refreshing.
    """

    db.session.add(item)
    db.session.commit()
    db.session.refresh(item)

    if not item:
        abort(codes.BAD_REQUEST, f"Object could not be created")

    return item


def blacklist(jti):
    """ Adds a blacklist to the database. """

    return db_add(Blacklist(jti))


def mediaType(name):
    """ Adds a media type to the database. """

    return db_add(MediaType(name))


def questionType(name):
    """ Adds a question type to the database. """

    return db_add(QuestionType(name))


def componentType(name):
    """ Adds a component type to the database. """

    return db_add(ComponentType(name))


def viewType(name):
    """ Adds a view type to the database. """

    return db_add(ViewType(name))


def role(name):
    """ Adds a role to the database. """

    return db_add(Role(name))


def city(name):
    """ Adds a city to the database. """

    return db_add(City(name))


def component(type_id, item_slide, data, x=0, y=0, w=0, h=0):
    """
    Adds a component to the slide at the specified coordinates with the
    provided size and data .
    """

    return db_add(Component(item_slide.id, type_id, data, x, y, w, h))


def image(filename, user_id):
    """
    Adds an image to the database and keeps track of who called the function.
    """

    return db_add(Media(filename, 1, user_id))


def user(email, password, role_id, city_id, name=None):
    """ Adds a user to the database using the provided arguments. """

    return db_add(User(email, password, role_id, city_id, name))


def question(name, total_score, type_id, item_slide):
    """
    Adds a question to the specified slide using the provided arguments.
    """

    return db_add(Question(name, total_score, type_id, item_slide.id))


def code(pointer, view_type_id):
    """ Adds a code to the database using the provided arguments. """

    code_string = utils.generate_unique_code()
    return db_add(Code(code_string, pointer, view_type_id))


def team(name, item_competition):
    """ Adds a team with the specified name to the provided competition. """

    item = db_add(Team(name, item_competition.id))

    # Add code for the team
    code(item.id, 1)

    return item


def slide(item_competition):
    """ Adds a slide to the provided competition. """

    order = Slide.query.filter(Slide.competition_id == item_competition.id).count()  # first element has index 0
    return db_add(Slide(order, item_competition.id))


def competition(name, year, city_id):
    """
    Adds a competition to the database using the
    provided arguments. Also adds slide and codes.
    """

    item_competition = _competition(name, year, city_id)

    # Add one slide for the competition
    slide(item_competition)

    # TODO: Add two teams

    return item_competition


def _competition(name, year, city_id, font=None):
    """
    Internal function. Adds a competition to the database
    using the provided arguments. Also adds codes.
    """

    item_competition = db_add(Competition(name, year, city_id))
    if font:
        item_competition.font = font

    # Add code for Judge view
    code(item_competition.id, 2)

    # Add code for Audience view
    code(item_competition.id, 3)

    utils.refresh(item_competition)
    return item_competition
