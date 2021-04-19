"""
This file contains some miscellaneous functionality.
"""

from app.core import db
from app.core.codes import generate_code_string
from app.database.models import Code


def generate_unique_code():
    """ Generates a unique competition code. """

    code = generate_code_string()
    while db.session.query(Code).filter(Code.code == code).count():
        code = generate_code_string()
    return code


def commit_and_refresh(item):
    """ Commits and refreshes the provided item. """

    db.session.commit()
    db.session.refresh(item)


def refresh(item):
    """ Refreshes the provided item. """

    db.session.refresh(item)


def commit(item):
    """ Commits. """

    db.session.commit()
