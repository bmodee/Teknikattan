"""
This file contains functionality to get data from the database.
"""

from app.core import db
from app.database.models import (
    City,
    Code,
    Competition,
    Component,
    ComponentType,
    MediaType,
    Question,
    QuestionType,
    Role,
    Slide,
    Team,
    User,
    ViewType,
)


def all(db_type):
    """ Gets all elements in the provided table. """

    return db_type.query.all()


def one(db_type, id, required=True, error_msg=None):
    """ Gets the element in the table that has the same id. """

    return db_type.query.filter(db_type.id == id).first_extended(required, error_msg)


def user_exists(email):
    """ Checks if an user has that email. """

    return User.query.filter(User.email == email).count() > 0


def code_by_code(code):
    """ Gets the code object associated with the provided code. """

    return Code.query.filter(Code.code == code.upper()).first()


def user(UID, required=True, error_msg=None):
    """ Gets the user object associated with the provided id. """

    return User.query.filter(User.id == UID).first_extended(required, error_msg)


def user_by_email(email, required=True, error_msg=None):
    """ Gets the user object associated with the provided email. """

    return User.query.filter(User.email == email).first_extended(required, error_msg)


def slide(CID, SOrder, required=True, error_msg=None):
    """ Gets the slide object associated with the provided id and order. """

    filters = (Slide.competition_id == CID) & (Slide.order == SOrder)
    return Slide.query.filter(filters).first_extended(required, error_msg)


def team(CID, TID, required=True, error_msg=None):
    """ Gets the team object associated with the provided id and competition id. """

    return Team.query.filter((Team.competition_id == CID) & (Team.id == TID)).first_extended(required, error_msg)


def question(CID, SOrder, QID, required=True, error_msg=None):
    """ Gets the question object associated with the provided id, slide order and competition id. """

    join_filters = (Slide.competition_id == CID) & (Slide.order == SOrder) & (Slide.id == Question.slide_id)
    return Question.query.join(Slide, join_filters).filter(Question.id == QID).first_extended(required, error_msg)


def code_list(competition_id):
    """ Gets a list of all code objects associated with a the provided competition. """

    team_view_id = 1
    join_filters = (Code.view_type_id == team_view_id) & (Team.id == Code.pointer)
    filters = ((Code.view_type_id != team_view_id) & (Code.pointer == competition_id))(
        (Code.view_type_id == team_view_id) & (competition_id == Team.competition_id)
    )
    return Code.query.join(Team, join_filters, isouter=True).filter(filters).all()


def question_list(CID):
    """ Gets a list of all question objects associated with a the provided competition. """

    join_filters = (Slide.competition_id == CID) & (Slide.id == Question.slide_id)
    return Question.query.join(Slide, join_filters).all()


def component_list(CID, SOrder):
    """ Gets a list of all component objects associated with a the provided competition id and slide order. """

    join_filters = (Slide.competition_id == CID) & (Slide.order == SOrder) & (Component.slide_id == Slide.id)
    return Component.query.join(Slide, join_filters).all()


def team_list(CID):
    """ Gets a list of all team objects associated with a the provided competition. """

    return Team.query.filter(Team.competition_id == CID).all()


def slide_list(CID):
    """ Gets a list of all slide objects associated with a the provided competition. """

    return Slide.query.filter(Slide.competition_id == CID).all()


def slide_count(CID):
    """ Gets the number of slides in the provided competition. """

    return Slide.query.filter(Slide.competition_id == CID).count()
