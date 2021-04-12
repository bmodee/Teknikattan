from app.core import db


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


def team(item_team, name=None, competition_id=None):
    if name:
        item_team.name = name
    if competition_id:
        item_team.competition_id = competition_id

    db.session.commit()
    db.session.refresh(item_team)
    return item_team


def competition(item, name=None, year=None, city_id=None):
    if name:
        item.name = name
    if year:
        item.year = year
    if city_id:
        item.city_id = city_id

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


def question(item_question, name=None, total_score=None, type_id=None, slide_id=None):

    if name:
        item_question.name = name

    if total_score:
        item_question.total_score = total_score

    if type_id:
        item_question.type_id = type_id

    if slide_id:
        item_question.slide_id = slide_id

    db.session.commit()
    db.session.refresh(item_question)

    return item_question
