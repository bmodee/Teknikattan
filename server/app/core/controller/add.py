from app.core import db
from app.core.models import Blacklist, City, Competition, Role, Slide, User


def default(item):
    db.session.add(item)
    db.session.commit()
    db.session.refresh(item)
    return item


def blacklist(jti):
    db.session.add(Blacklist(jti))
    db.session.commit()


def slide(item_competition):
    order = Slide.query.filter(Slide.competition_id == item_competition.id).count()
    item = Slide(order, item_competition.id)
    db.session.add(item)
    db.session.commit()
    db.session.refresh(item)
    return item
