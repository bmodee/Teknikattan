"""
This file contains functionality to get data from the database.
"""

import app.core.http_codes as codes
from app.core import db
from app.core.parsers import sentinel
from flask_restx.errors import abort
from sqlalchemy import exc


def default(item, **kwargs):
    """
    For every keyword argument, set that attribute on item to the given value.
    Raise error if item doesn't already have that attribute. Do nothing if the
    value for a given key is None. Works for any type of item.

    Example:
    >>> user = default(user, name="Karl Karlsson")  # Change name
    >>> user.name
    Karl Karlsson
    >>> user = default(user, efternamn="Jönsson")   # Try to set attribute that doesn't exist
    AttributeError: Item of type <class 'app.database.models.User'> has no attribute 'efternamn'
    >>> user = default(user, name=None)             # Nothing happens if value is None
    >>> user.name
    Karl Karlsson
    """

    for key, value in kwargs.items():
        if not hasattr(item, key):
            raise AttributeError(f"Item of type {type(item)} has no attribute '{key}'")
        if value is not sentinel:
            setattr(item, key, value)
    try:
        db.session.commit()
    except exc.IntegrityError:
        abort(codes.CONFLICT, f"Item of type {type(item)} cannot be edited due to an Integrity Constraint")

    db.session.refresh(item)
    return item
