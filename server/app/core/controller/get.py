from app.core.models import Competition, Question, Slide, Team, User


def slide_by_order(CID, order):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.order == order)).first()


def slide(CID, SID):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.id == SID)).first()


def team(CID, TID):
    return Team.query.filter((Team.competition_id == CID) & (Team.id == TID)).first()


def question(CID, QID):
    slide_ids = set(
        [x.id for x in Slide.query.filter(Slide.competition_id == CID).all()]
    )  # TODO: Filter using database instead of creating a set of slide_ids
    return Question.query.filter(Question.slide_id.in_(slide_ids) & (Question.id == QID)).first()


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


def search_slide(
    slide_order=None, title=None, body=None, competition_id=None, page=0, page_size=15, order=1, order_by=None
):
    query = Slide.query
    if slide_order:
        query = query.filter(Slide.order == slide_order)
    if title:
        query = query.filter(Slide.title.like(f"%{title}%"))
    if body:
        query = query.filter(Slide.body.like(f"%{body}%"))
    if competition_id:
        query = query.filter(Slide.competition_id == competition_id)

    order_column = Slide.id  # Default order_by
    if order_by:
        order_column = getattr(Slide.__table__.c, order_by)

    return _search(query, order_column, page, page_size, order)


def search_questions(
    name=None,
    total_score=None,
    type_id=None,
    slide_id=None,
    competition_id=None,
    page=0,
    page_size=15,
    order=1,
    order_by=None,
):
    query = Question.query
    if name:
        query = query.filter(Question.name.like(f"%{name}%"))
    if total_score:
        query = query.filter(Question.total_score == total_score)
    if type_id:
        query = query.filter(Question.type_id == type_id)
    if slide_id:
        query = query.filter(Question.slide_id == slide_id)
    if competition_id:
        slide_ids = set(
            [x.id for x in Slide.query.filter(Slide.competition_id == competition_id).all()]
        )  # TODO: Filter using database instead of creating a set of slide_ids
        query = query.filter(Question.slide_id.in_(slide_ids))

    order_column = Question.id  # Default order_by
    if order_by:
        order_column = getattr(Question.__table__.c, order_by)

    return _search(query, order_column, page, page_size, order)


def search_competitions(name=None, year=None, city_id=None, page=0, page_size=15, order=1, order_by=None):
    query = Competition.query
    if name:
        query = query.filter(Competition.name.like(f"%{name}%"))
    if year:
        query = query.filter(Competition.year == year)
    if city_id:
        query = query.filter(Competition.city_id == city_id)

    order_column = Competition.year  # Default order_by
    if order_by:
        order_column = getattr(Competition.columns, order_by)

    return _search(query, order_column, page, page_size, order)
