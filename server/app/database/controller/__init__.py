# import add, get
from app.core import db
from app.database.controller import add, delete, edit, get, search


def commit_and_refresh(item):
    db.session.commit()
    db.session.refresh(item)


def refresh(item):
    db.session.refresh(item)


def commit(item):
    db.session.commit()
