from app.core.models import Competition, Slide, Team, User


def slide_by_order(CID, order):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.order == order)).first()


def slide(CID, SID):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.id == SID)).first()


def team(CID, TID):
    return Team.query.filter((Team.competition_id == CID) & (Team.id == TID)).first()


def _search(query, order_column, page=0, page_size=15, order=1):
    if order == 1:
        query = query.order_by(order_column)
    else:
        query = query.order_by(order_column.desc())

    total = query.count()
    query = query.limit(page_size).offset(page * page_size)
    items = query.all()
    return items, total


def search_user(email=None, name=None, city_id=None, role_id=None, page=0, page_size=15, order=1, order_by=None):
    query = User.query
    if name:
        query = query.filter(User.name.like(f"%{name}%"))
    if email:
        query = query.filter(User.email.like(f"%{email}%"))
    if city_id:
        query = query.filter(User.city_id == city_id)
    if role_id:
        query = query.filter(User.role_id == role_id)

    order_column = User.id  # Default order_by
    if order_by:
        order_column = getattr(User.__table__.c, order_by)

    return _search(query, order_column, page, page_size, order)


def search_competitions(
    name=None, year=None, city_id=None, style_id=None, page=0, page_size=15, order=1, order_by=None
):
    query = Competition.query
    if name:
        query = query.filter(Competition.name.like(f"%{name}%"))
    if year:
        query = query.filter(Competition.year == year)
    if city_id:
        query = query.filter(Competition.city_id == city_id)
    if style_id:
        query = query.filter(Competition.style_id == style_id)

    order_column = Competition.year  # Default order_by
    if order_by:
        order_column = getattr(Competition.columns, order_by)

    return _search(query, order_column, page, page_size, order)
