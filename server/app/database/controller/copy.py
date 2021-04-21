"""
This file contains functionality to copy and duplicate data to the database.
"""

from app.database.controller import add, get, search, utils
from app.database.models import Question


def _question(item_question_old, slide_id):
    """
    Internal function. Makes a copy of the provided question item to the
    specified slide. Does not copy team, question answers or alternatives.
    """

    item_question_new = add.db_add(
        Question(
            item_question_old.name,
            item_question_old.total_score,
            item_question_old.type_id,
            slide_id,
        )
    )

    # TODO: Add question alternatives
    # for item_alternatives in item_question_old.alternatives:
    #     dbc.add.alternatives()

    return item_question_new


def _component(item_component, item_slide_new):
    """
    Internal function. Makes a copy of the provided
    component item to the specified slide.
    """

    add.component(
        item_component.type_id,
        item_slide_new,
        item_component.data,
        item_component.x,
        item_component.y,
        item_component.w,
        item_component.h,
    )


def slide(item_slide_old):
    """
    Deep copies a slide to the same competition.
    Does not copy team, question answers or alternatives.
    """

    item_competition = get.competition(item_slide_old.competition_id)

    return slide_to_competition(item_slide_old, item_competition)


def slide_to_competition(item_slide_old, item_competition):
    """
    Deep copies a slide to the provided competition.
    Does not copy team, question answers or alternatives.
    """

    item_slide_new = add.slide(item_competition)

    # Copy all fields
    item_slide_new.title = item_slide_old.title
    item_slide_new.body = item_slide_old.body
    item_slide_new.timer = item_slide_old.timer
    item_slide_new.settings = item_slide_old.settings

    # TODO: Add background image

    for item_component in item_slide_old.components:
        _component(item_component, item_slide_new)

    for item_question in item_slide_old.questions:
        _question(item_question, item_slide_new.id)

    utils.commit_and_refresh(item_slide_new)
    return item_slide_new


def competition(item_competition_old):
    """
    Adds a deep-copy of the provided competition.
    Will not copy teams, question answers or alternatives.
    """

    name = "Kopia av " + item_competition_old.name
    item_competition, total = search.competition(name=name)
    if item_competition:
        print(f"{item_competition[total-1].name}, {total=}")
        name = "Kopia av " + item_competition[total - 1].name

    item_competition_new = add._competition(
        name,
        item_competition_old.year,
        item_competition_old.city_id,
        item_competition_old.font,
    )
    # TODO: Add background image

    for item_slide in item_competition_old.slides:
        slide_to_competition(item_slide, item_competition_new)

    return item_competition_new
