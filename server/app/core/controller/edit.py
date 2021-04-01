from app.core import db


def default(item):
    db.session.commit()
    db.session.refresh(item)
    return item


def switch_order(item1, item2):
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


def slide(item, title=None, timer=None):
    if title:
        item.title = title
    if timer:
        item.timer = timer

    db.session.commit()
    db.session.refresh(item)
    return item


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
