from app.core import db
from app.core.models import Blacklist, City, Competition, Role, Slide, User


def competition(item, name=None, year=None, city_id=None, style_id=None):
    if name:
        item.name = name
    if year:
        item.year = year
    if city_id:
        item.city_id = city_id
    if style_id:
        item.style_id = style_id

    db.session.commit()
    db.session.refresh(item)
    return item


def user(item, name=None, email=None, city_id=None, role_id=None):

    if name:
        item.name = name.title()

    if email:
        item.email = email

    if city_id:
        item.city_id = city_id

    if role_id:
        item.role_id = role_id

    db.session.commit()
    db.session.refresh(item)
    return item
