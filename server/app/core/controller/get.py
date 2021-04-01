from app.core.models import Competition, Slide, Team, User


def slide_by_order(CID, order):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.order == order)).first()


def slide(CID, SID):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.id == SID)).first()


def team(CID, TID):
    return Team.query.filter((Team.competition_id == CID) & (Team.id == TID)).first()


def search_user(email=None, name=None, city_id=None, role_id=None, page=0, page_size=15):
    query = User.query
    if name:
        query = query.filter(User.name.like(f"%{name}%"))
    if email:
        query = query.filter(User.email.like(f"%{email}%"))
    if city_id:
        query = query.filter(User.city_id == city_id)
    if role_id:
        query = query.filter(User.role_id == role_id)

    total = query.count()
    query = query.limit(page_size).offset(page * page_size)
    result = query.all()

    return result, total


def search_competitions(name=None, year=None, city_id=None, style_id=None, page=0, page_size=15):
    query = Competition.query
    if name:
        query = query.filter(Competition.name.like(f"%{name}%"))
    if year:
        query = query.filter(Competition.year == year)
    if city_id:
        query = query.filter(Competition.city_id == city_id)
    if style_id:
        query = query.filter(Competition.style_id == style_id)

    total = query.count()
    query = query.limit(page_size).offset(page * page_size)
    result = query.all()

    return result, total
