"""
This file contains functionality to get data from the database.
"""

from app.core import db
from app.core.parsers import sentinel


def switch_order(item1, item2):
    """ Switches order between two slides. """

    old_order = item1.order
    new_order = item2.order

    item2.order = -1
    db.session.commit()
    db.session.refresh(item2)

    item1.order = new_order
    db.session.commit()
    db.session.refresh(item1)

    item2.order = old_order
    db.session.commit()
    db.session.refresh(item2)

    return item1


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
    db.session.commit()
    db.session.refresh(item)
    return item
