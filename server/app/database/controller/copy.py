"""
This file contains functionality to copy and duplicate data to the database.
"""

from app.database.controller import add, get, search, utils
from app.database.models import Competition, Question
from app.database.types import IMAGE_COMPONENT_ID, QUESTION_COMPONENT_ID, TEXT_COMPONENT_ID


def _alternative(item_alternative_old, question_id):
    """
    Internal function. Makes a copy of the provided question alternative.
    """

    return add.question_alternative(
        question_id,
        item_alternative_old.alternative,
        item_alternative_old.alternative_order,
        item_alternative_old.correct,
        item_alternative_old.correct_order,
    )


def _question(item_question_old, slide_id):
    """
    Internal function. Makes a copy of the provided question item to the
    specified slide. Does not copy team, question answers.
    """

    item_question_new = add.db_add(
        Question(
            item_question_old.name,
            item_question_old.total_score,
            item_question_old.type_id,
            slide_id,
            item_question_old.correcting_instructions,
        )
    )

    for item_alternative in item_question_old.alternatives:
        _alternative(item_alternative, item_question_new.id)

    return item_question_new


def _component(item_component, item_slide_new):
    """
    Internal function. Makes a copy of the provided
    component item to the specified slide.
    """

    component(item_component, item_slide_new.id, item_component.view_type_id)


def component(item_component, slide_id_new, view_type_id):
    """
    Makes a copy of the provided component item
    to the specified slide and view_type.
    """

    data = {}
    if item_component.type_id == TEXT_COMPONENT_ID:
        data["text"] = item_component.text
    elif item_component.type_id == IMAGE_COMPONENT_ID:
        data["media_id"] = item_component.media_id
    elif item_component.type_id == QUESTION_COMPONENT_ID:
        data["question_id"] = item_component.question_id

    return add.component(
        item_component.type_id,
        slide_id_new,
        view_type_id,
        item_component.x,
        item_component.y,
        item_component.w,
        item_component.h,
        copy=True,
        **data,
    )


def slide(item_slide_old):
    """
    Deep copies a slide to the same competition.
    Does not copy team and question answers.
    """

    item_competition = get.competition(item_slide_old.competition_id)

    return slide_to_competition(item_slide_old, item_competition)


def slide_to_competition(item_slide_old, item_competition):
    """
    Deep copies a slide to the provided competition.
    Does not copy team, question answers.
    """

    item_slide_new = add.slide(item_competition.id, item_slide_old.order)

    # Copy all fields
    item_slide_new.title = item_slide_old.title
    item_slide_new.body = item_slide_old.body
    item_slide_new.timer = item_slide_old.timer
    item_slide_new.settings = item_slide_old.settings
    item_slide_new.background_image_id = item_slide_old.background_image_id

    for item_component in item_slide_old.components:
        _component(item_component, item_slide_new)
    for item_question in item_slide_old.questions:
        _question(item_question, item_slide_new.id)

    utils.commit_and_refresh(item_slide_new)
    return item_slide_new


def competition(item_competition_old):
    """
    Adds a deep-copy of the provided competition.
    Will not copy teams, question answers.
    """

    name = "Kopia av " + item_competition_old.name

    while item_competition := Competition.query.filter(Competition.name == name).first():
        name = "Kopia av " + item_competition.name

    item_competition_new = add._competition_no_slides(
        name,
        item_competition_old.year,
        item_competition_old.city_id,
        item_competition_old.font,
    )

    item_competition_new.background_image_id = item_competition_old.background_image_id

    for item_slide in item_competition_old.slides:
        slide_to_competition(item_slide, item_competition_new)

    return item_competition_new
