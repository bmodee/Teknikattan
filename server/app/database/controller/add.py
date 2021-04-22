"""
This file contains functionality to add data to the database.
"""

from sqlalchemy.orm.session import sessionmaker
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
    QuestionAlternative,
    QuestionAnswer,
    QuestionType,
    Role,
    Slide,
    Team,
    User,
    ViewType,
)
from flask_restx import abort
from sqlalchemy import exc


def db_add(item):
    """
    Internal function. Adds item to the database
    and handles comitting and refreshing.
    """
    try:
        db.session.add(item)
        db.session.commit()
        db.session.refresh(item)
    except (exc.SQLAlchemyError, exc.DBAPIError):
        db.session.rollback()
        # SQL errors such as item already exists
        abort(codes.INTERNAL_SERVER_ERROR, f"Item of type {type(item)} could not be created")
    except:
        db.session.rollback()
        # Catching other errors
        abort(codes.INTERNAL_SERVER_ERROR, f"Something went wrong when creating {type(item)}")

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


def component(type_id, slide_id, data, x=0, y=0, w=0, h=0):
    """
    Adds a component to the slide at the specified coordinates with the
    provided size and data .
    """

    return db_add(Component(slide_id, type_id, data, x, y, w, h))


def image(filename, user_id):
    """
    Adds an image to the database and keeps track of who called the function.
    """

    return db_add(Media(filename, 1, user_id))


def user(email, password, role_id, city_id, name=None):
    """ Adds a user to the database using the provided arguments. """

    return db_add(User(email, password, role_id, city_id, name))


def question(name, total_score, type_id, slide_id):
    """
    Adds a question to the specified slide using the provided arguments.
    """

    return db_add(Question(name, total_score, type_id, slide_id))


def question_alternative(text, value, question_id):
    return db_add(QuestionAlternative(text, value, question_id))


def question_answer(data, score, question_id, team_id):
    return db_add(QuestionAnswer(data, score, question_id, team_id))


def code(pointer, view_type_id):
    """ Adds a code to the database using the provided arguments. """

    code_string = utils.generate_unique_code()
    return db_add(Code(code_string, pointer, view_type_id))


def team(name, competition_id):
    """ Adds a team with the specified name to the provided competition. """

    item = db_add(Team(name, competition_id))

    # Add code for the team
    code(item.id, 1)

    return item


def slide(competition_id):
    """ Adds a slide to the provided competition. """

    # Get the last order from given competition
    order = Slide.query.filter(Slide.competition_id == competition_id).count()

    # Add slide
    item_slide = db_add(Slide(order, competition_id))

    # Add default question
    question(f"Fråga {item_slide.order + 1}", 10, 0, item_slide.id)

    item_slide = utils.refresh(item_slide)
    return item_slide


def slide_without_question(competition_id):
    """ Adds a slide to the provided competition. """

    # Get the last order from given competition
    order = Slide.query.filter(Slide.competition_id == competition_id).count()

    # Add slide
    item_slide = db_add(Slide(order, competition_id))

    item_slide = utils.refresh(item_slide)
    return item_slide


def competition(name, year, city_id):
    """
    Adds a competition to the database using the
    provided arguments. Also adds slide and codes.
    """
    item_competition = db_add(Competition(name, year, city_id))

    # Add default slide
    slide(item_competition.id)

    # Add code for Judge view
    code(item_competition.id, 2)

    # Add code for Audience view
    code(item_competition.id, 3)

    item_competition = utils.refresh(item_competition)
    return item_competition


def _competition_no_slides(name, year, city_id, font=None):
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

    item_competition = utils.refresh(item_competition)
    return item_competition