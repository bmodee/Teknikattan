from app.core import db
from app.core.models import Blacklist, City, Competition, Role, Slide, User


def default(item):
    db.session.delete(item)
    db.session.commit()


def slide(item):
    default(item)


def team(item):
    default(item)


def competition(item):
    # Remove all slides from competition
    for item_slide in item.slides:
        slide(item_slide)
    # Remove all teams from competition
    for item_team in item.teams:
        team(item_team)

    default(item)
