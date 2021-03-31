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


def slide(competition_id):
    order = Slide.query.filter(Slide.competition_id == competition_id).count()
    item = Slide(order, competition_id)
    db.session.add(item)
    db.session.commit()
    db.session.refresh(item)
    return item
