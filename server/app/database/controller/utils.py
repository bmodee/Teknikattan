"""
This file contains some miscellaneous functionality.
"""

import app.core.http_codes as codes
from app.core import db
from app.core.codes import generate_code_string
from app.database.models import Code
from flask_restx import abort


def move_slides(item_competition, from_order, to_order):
    """
    Move slide from from_order to to_order in item_competition.
    """

    num_slides = len(item_competition.slides)
    assert 0 <= from_order < num_slides, "Invalid order to move from"
    assert 0 <= to_order < num_slides, "Invalid order to move to"

    # This function is sooo terrible, someone please tell me how to update
    # multiple values in the database at the same time with unique constraints.
    # If you update all the values at the same time none of them will collide
    # but that database doesn't know that so you have to update them to some
    # other value before and then change every value back to the correct one,
    # so 2 commits.

    # An example will follow the entire code to make it clear what it does
    # Lets say we have 5 slides, and we want to move the slide at index 1
    # to index 4.
    # We begin with a list of slides with orders [0, 1, 2, 3, 4]

    slides = item_competition.slides

    change = 1 if to_order < from_order else -1
    start_order = min(from_order, to_order)
    end_order = max(from_order, to_order)

    # Move slides up 100
    for item_slide in slides:
        item_slide.order += 100

    # Our slide orders now look like [100, 101, 102, 103, 104]

    # Move slides between from and to order either up or down, but minus in front
    for item_slide in slides:
        if start_order <= item_slide.order - 100 <= end_order:
            item_slide.order = -(item_slide.order + change)

    # Our slide orders now look like [100, -100, -101, -102, -103]

    # Find the slide that was to be moved and change it to correct order with minus in front
    for item_slide in slides:
        if item_slide.order == -(from_order + change + 100):
            item_slide.order = -(to_order + 100)
            break

    # Our slide orders now look like [100, -104, -101, -102, -103]

    db.session.commit()

    # Negate all order so that they become positive
    for item_slide in slides:
        if start_order <= -(item_slide.order + 100) <= end_order:
            item_slide.order = -(item_slide.order)

    # Our slide orders now look like [100, 104, 101, 102, 103]

    for item_slide in slides:
        item_slide.order -= 100

    # Our slide orders now look like [0, 4, 1, 2, 3]

    # We have now successfully moved slide 1 to 4

    return commit_and_refresh(item_competition)


def generate_unique_code():
    """ Generates a unique competition code. """

    code = generate_code_string()
    while db.session.query(Code).filter(Code.code == code).count():
        code = generate_code_string()
    return code


def refresh(item):
    """ Refreshes the provided item. """

    try:
        db.session.refresh(item)
    except Exception as e:
        abort(codes.INTERNAL_SERVER_ERROR, f"Refresh failed!\n{str(e)}")

    return item


def commit():
    """ Commits to the database. """

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        abort(codes.INTERNAL_SERVER_ERROR, f"Commit failed!\n{str(e)}")


def commit_and_refresh(item):
    """ Commits and refreshes the provided item. """

    commit()
    return refresh(item)
