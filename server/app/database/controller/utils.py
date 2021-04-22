"""
This file contains some miscellaneous functionality.
"""

import app.core.http_codes as codes
from app.core import db
from app.core.codes import generate_code_string
from app.database.models import Code
from flask_restx import abort
from sqlalchemy import exc


def move_slides(item_competition, start_order, end_order):
    slides = item_competition.slides
    # Move up
    if start_order < end_order:
        for i in range(start_order + 1, end_order):
            slides[i].order -= 1

    # Move down
    elif start_order > end_order:
        for i in range(end_order, start_order):
            slides[i].order += 1

    # start = 5, end = 1
    # 1->2, 2->3, 4->5
    # 5 = 1

    slides[start_order].order = end_order
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
    """ Commits. """
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        abort(codes.INTERNAL_SERVER_ERROR, f"Commit failed!\n{str(e)}")


def commit_and_refresh(item):
    """ Commits and refreshes the provided item. """

    commit()
    return refresh(item)
