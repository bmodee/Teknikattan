"""
This file contains some miscellaneous functionality.
"""

from app.apis import http_codes
from app.core import db
from app.core.codes import generate_code_string
from app.database.models import Code
from flask_smorest import abort


def move_order(orders, order_key, from_order, to_order):
    """
    Move key from from_order to to_order in db_item. See examples in
    alternatives.py and slides.py.
    """

    num_orders = len(orders)
    assert 0 <= from_order < num_orders, "Invalid order to move from"
    assert 0 <= to_order < num_orders, "Invalid order to move to"

    # This function is sooo terrible, someone please tell me how to update
    # multiple values in the database at the same time with unique constraints.
    # If you update all the values at the same time none of them will collide
    # but that database doesn't know that so you have to update them to some
    # other value before and then change every value back to the correct one,
    # so 2 commits.

    # An example will follow the entire code to make it clear what it does
    # Lets say we have 5 orders, and we want to move the item at index 1
    # to index 4.
    # We begin with a list of item with orders [0, 1, 2, 3, 4]

    change = 1 if to_order < from_order else -1
    start_order = min(from_order, to_order)
    end_order = max(from_order, to_order)

    # Move orders up 100
    for item_with_order in orders:
        setattr(item_with_order, order_key, getattr(item_with_order, order_key) + 100)

    # Our items now look like [100, 101, 102, 103, 104]

    # Move orders between from and to order either up or down, but minus in front
    for item_with_order in orders:
        if start_order <= getattr(item_with_order, order_key) - 100 <= end_order:
            setattr(item_with_order, order_key, -(getattr(item_with_order, order_key) + change))

    # Our items now look like [100, -100, -101, -102, -103]

    # Find the item that was to be moved and change it to correct order with minus in front
    for item_with_order in orders:
        if getattr(item_with_order, order_key) == -(from_order + change + 100):
            setattr(item_with_order, order_key, -(to_order + 100))
            break

    # Our items now look like [100, -104, -101, -102, -103]

    db.session.commit()

    # Negate all order so that they become positive
    for item_with_order in orders:
        if start_order <= -(getattr(item_with_order, order_key) + 100) <= end_order:
            setattr(item_with_order, order_key, -getattr(item_with_order, order_key))

    # Our items now look like [100, 104, 101, 102, 103]

    for item_with_order in orders:
        setattr(item_with_order, order_key, getattr(item_with_order, order_key) - 100)

    # Our items now look like [0, 4, 1, 2, 3]

    # We have now successfully moved item from order 1 to order 4

    db.session.commit()


def count(db_type, filter=None):
    """
    Count number of db_type items that match all keys and values in filter.

    >>> count(User, {"city_id": 1}) # Get number of users with city_id equal to 1
    5
    """

    filter = filter or {}
    query = db_type.query
    for key, value in filter.items():
        query = query.filter(getattr(db_type, key) == value)
    return query.count()


def generate_unique_code():
    """ Generates a unique competition code. """

    code = generate_code_string()

    while count(Code, {"code": code}):
        code = generate_code_string()
    return code


def refresh(item):
    """ Refreshes the provided item. """

    try:
        db.session.refresh(item)
    except Exception as e:
        abort(http_codes.INTERNAL_SERVER_ERROR, f"Refresh failed!\n{str(e)}")

    return item


def commit():
    """ Commits to the database. """

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        abort(http_codes.INTERNAL_SERVER_ERROR, f"Commit failed!\n{str(e)}")


def commit_and_refresh(item):
    """ Commits and refreshes the provided item. """

    commit()
    return refresh(item)
