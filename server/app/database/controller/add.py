"""
This file contains functionality to add data to the database.
"""

import os

import app.core.http_codes as codes
import app.database.controller as dbc
from app.core import db
from app.database.models import (
    Blacklist,
    City,
    Code,
    Competition,
    ComponentType,
    ImageComponent,
    Media,
    MediaType,
    Question,
    QuestionAlternative,
    QuestionAlternativeAnswer,
    QuestionComponent,
    QuestionScore,
    QuestionType,
    Role,
    Slide,
    Team,
    TextComponent,
    User,
    ViewType,
    Whitelist,
)
from app.database.types import IMAGE_COMPONENT_ID, QUESTION_COMPONENT_ID, TEXT_COMPONENT_ID
from flask import current_app
from flask.globals import current_app
from flask_restx import abort
from PIL import Image
from sqlalchemy import exc


def db_add(item):
    """
    Internal function that add item to the database.
    Handle different types of errors that occur when inserting an item into the database by calling abort.
    """
    try:
        db.session.add(item)
        db.session.commit()
        db.session.refresh(item)
    except (exc.IntegrityError):
        abort(codes.CONFLICT, f"Item of type {type(item)} cannot be added due to an Integrity Constraint")
    except (exc.SQLAlchemyError, exc.DBAPIError):
        db.session.rollback()
        # SQL errors such as item already exists
        abort(
            codes.INTERNAL_SERVER_ERROR,
            f"Item of type {type(item)} could not be created",
        )
    except:
        db.session.rollback()
        # Catching other errors
        abort(
            codes.INTERNAL_SERVER_ERROR,
            f"Something went wrong when creating {type(item)}",
        )

    return item


def component(type_id, slide_id, view_type_id, x=0, y=0, w=0, h=0, copy=False, **data):
    """
    Adds a component to the slide at the specified
    coordinates with the provided size and data.
    """

    if type_id == TEXT_COMPONENT_ID:
        item = db_add(
            TextComponent(slide_id, type_id, view_type_id, x, y, w, h),
        )
        item.text = data.get("text")
    elif type_id == IMAGE_COMPONENT_ID:
        if not copy:  # Scale image if adding a new one, a copied image should keep it's size
            item_image = dbc.get.one(Media, data["media_id"])
            filename = item_image.filename
            path = os.path.join(
                current_app.config["UPLOADED_PHOTOS_DEST"],
                filename,
            )

            with Image.open(path) as im:
                h = im.height
                w = im.width

            largest = max(w, h)
            if largest > 600:
                ratio = 600 / largest
                w *= ratio
                h *= ratio

        item = db_add(
            ImageComponent(slide_id, type_id, view_type_id, x, y, w, h),
        )
        item.media_id = data.get("media_id")
    elif type_id == QUESTION_COMPONENT_ID:
        item = db_add(
            QuestionComponent(slide_id, type_id, view_type_id, x, y, w, h),
        )
        item.question_id = data.get("question_id")
    else:
        abort(codes.BAD_REQUEST, f"Invalid type_id{type_id}")

    item = dbc.utils.commit_and_refresh(item)
    return item


def code(view_type_id, competition_id=None, team_id=None):
    """ Adds a code to the database using the provided arguments. """

    code_string = dbc.utils.generate_unique_code()
    return db_add(Code(code_string, view_type_id, competition_id, team_id))


def team(name, competition_id):
    """ Adds a team with the specified name to the provided competition. """

    item = db_add(Team(name, competition_id))

    # Add code for the team
    code(1, competition_id, item.id)

    return item


def slide(competition_id):
    """ Adds a slide to the provided competition. """

    # Get the last order from given competition
    order = dbc.utils.count(Slide, {"competition_id": competition_id})

    # Add slide
    item_slide = db_add(Slide(order, competition_id))

    # Add default question
    question(f"Fråga {item_slide.order + 1}", 10, 1, item_slide.id)

    item_slide = dbc.utils.refresh(item_slide)
    return item_slide


def slide_without_question(competition_id):
    """ Adds a slide to the provided competition. """

    # Get the last order from given competition
    order = dbc.utils.count(Slide, {"competition_id": competition_id})

    # Add slide
    item_slide = db_add(Slide(order, competition_id))

    item_slide = dbc.utils.refresh(item_slide)
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
    code(2, item_competition.id)

    # Add code for Audience view
    code(3, item_competition.id)

    # Add code for Operator view
    code(4, item_competition.id)

    item_competition = dbc.utils.refresh(item_competition)
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
    code(2, item_competition.id)

    # Add code for Audience view
    code(3, item_competition.id)

    # Add code for Operator view
    code(4, item_competition.id)

    item_competition = dbc.utils.refresh(item_competition)
    return item_competition


def blacklist(jti):
    """ Adds a blacklist to the database. """

    return db_add(Blacklist(jti))


def whitelist(jti, user_id=None, competition_id=None):
    """ Adds a whitelist to the database. """

    return db_add(Whitelist(jti, user_id, competition_id))


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


def image(filename, user_id):
    """
    Adds an image to the database and keeps track of who called the function.
    """

    return db_add(Media(filename, 1, user_id))


def user(email, password, role_id, city_id, name=None):
    """ Adds a user to the database using the provided arguments. """

    return db_add(User(email, password, role_id, city_id, name))


def question(name, total_score, type_id, slide_id, correcting_instructions=None):
    """
    Adds a question to the specified slide using the provided arguments.
    """

    return db_add(Question(name, total_score, type_id, slide_id, correcting_instructions))


def question_alternative(alternative, correct, question_id):
    """
    Adds a question alternative to the specified
    question using the provided arguments.
    """

    order = dbc.utils.count(QuestionAlternative, {"question_id": question_id})
    return db_add(QuestionAlternative(alternative, order, correct, order, question_id))


def question_score(score, question_id, team_id):
    """
    Adds a question answer to the specified team
    and question using the provided arguments.
    """

    return db_add(QuestionScore(score, question_id, team_id))


def question_alternative_answer(answer, question_alternative_id, team_id):
    """
    Adds a question answer to the specified team
    and question using the provided arguments.
    """

    return db_add(QuestionAlternativeAnswer(answer, question_alternative_id, team_id))
