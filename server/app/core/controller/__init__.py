# import add, get
from app.core import db
from app.core.controller import add, edit, get


def delete(item):
    db.session.delete(item)
    db.session.commit()
