import app.database.controller as dbc
from app.core import db
from app.database.models import Blacklist, City, Competition, Role, Slide, User


def default(item):
    db.session.delete(item)
    db.session.commit()


def component(item_component):
    default(item_component)


def _slide(item_slide):
    for item_question in item_slide.questions:
        question(item_question)

    for item_component in item_slide.components:
        default(item_component)

    default(item_slide)


def slide(item_slide):
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
    for item_question_answer in item_team.question_answers:
        question_answers(item_question_answer)
    default(item_team)


def question(item_question):
    for item_question_answer in item_question.question_answers:
        question_answers(item_question_answer)
    for item_alternative in item_question.alternatives:
        alternatives(item_alternative)
    default(item_question)


def alternatives(item_alternatives):
    default(item_alternatives)


def question_answers(item_question_answers):
    default(item_question_answers)


def competition(item_competition):
    for item_slide in item_competition.slides:
        _slide(item_slide)
    for item_team in item_competition.teams:
        team(item_team)

    # TODO codes
    default(item_competition)
