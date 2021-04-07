from app.core import db
from app.core.models import Blacklist, City, Competition, MediaType, Question, QuestionType, Role, Slide, Team, User


def db_add(func):
    def wrapper(*args, **kwargs):
        item = func(*args, **kwargs)
        db.session.add(item)
        db.session.commit()
        db.session.refresh(item)
        return item

    return wrapper


@db_add
def blacklist(jti):
    return Blacklist(jti)


@db_add
def slide(item_competition):
    order = Slide.query.filter(Slide.competition_id == item_competition.id).count()  # first element has index 0
    return Slide(order, item_competition.id)


@db_add
def user(email, plaintext_password, role_id, city_id, name=None):
    return User(email, plaintext_password, role_id, city_id, name)


@db_add
def question(name, order, type_id, item_slide):
    return Question(name, order, type_id, item_slide.id)


@db_add
def competition(name, year, city_id):
    return Competition(name, year, city_id)


@db_add
def team(name, item_competition):
    return Team(name, item_competition.id)


@db_add
def mediaType(name):
    return MediaType(name)


@db_add
def questionType(name):
    return QuestionType(name)


@db_add
def role(name):
    return Role(name)


@db_add
def city(name):
    return City(name)
