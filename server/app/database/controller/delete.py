"""
This file contains functionality to delete data to the database.
"""

import app.database.controller as dbc
from app.apis import http_codes
from app.core import db
from app.database.models import QuestionAlternativeAnswer, QuestionScore, Whitelist
from flask_smorest import abort
from sqlalchemy.exc import IntegrityError


def default(item):
    """ Deletes item and commits. """

    try:
        db.session.delete(item)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(http_codes.CONFLICT, message=f"Kunde inte ta bort objektet")
    except:
        db.session.rollback()
        abort(http_codes.INTERNAL_SERVER_ERROR, message=f"Kunde inte ta bort objektet")


def whitelist_to_blacklist(filters):
    """
    Remove whitelist by condition(filters) and insert those into blacklist.
    Example: When delete user all whitelisted tokens for that user should
             be blacklisted.
    """

    whitelist = Whitelist.query.filter(filters).all()
    for item in whitelist:
        dbc.add.blacklist(item.jti)

    Whitelist.query.filter(filters).delete()
    dbc.utils.commit()


def component(item_component):
    """ Deletes component. """

    default(item_component)


def _slide(item_slide):
    """ Internal delete for slide. """

    for item_question in item_slide.questions:
        question(item_question)
    for item_component in item_slide.components:
        default(item_component)

    default(item_slide)


def slide(item_slide):
    """ Deletes slide and updates order of other slides if neccesary. """

    competition_id = item_slide.competition_id
    slide_order = item_slide.order

    _slide(item_slide)

    # Update slide order for all slides after the deleted slide
    slides_in_same_competition = dbc.get.slide_list(competition_id)
    for other_slide in slides_in_same_competition:
        if other_slide.order > slide_order:
            other_slide.order -= 1

    db.session.commit()


def team(item_team):
    """ Deletes team, its question answers and the code. """

    for item_question_answer in item_team.question_alternative_answers:
        default(item_question_answer)
    for item_code in item_team.code:
        code(item_code)

    default(item_team)


def question(item_question):
    """ Deletes question and its alternatives and answers. """

    scores = QuestionScore.query.filter(QuestionScore.question_id == item_question.id).all()

    for item_question_score in scores:
        default(item_question_score)

    for item_alternative in item_question.alternatives:
        alternatives(item_alternative)

    default(item_question)


def alternatives(item_alternatives):
    """ Deletes question alternative. """
    answers = QuestionAlternativeAnswer.query.filter(
        QuestionAlternativeAnswer.question_alternative_id == item_alternatives.id
    ).all()
    for item_answer in answers:
        default(item_answer)

    default(item_alternatives)


def competition(item_competition):
    """ Deletes competition, its slides, teams and codes. """

    for item_slide in item_competition.slides:
        _slide(item_slide)
    for item_team in item_competition.teams:
        team(item_team)
    for item_code in item_competition.codes:
        code(item_code)

    default(item_competition)


def code(item_code):
    """ Deletes competition code. """

    default(item_code)
