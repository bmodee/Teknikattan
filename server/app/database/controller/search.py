from app.database.models import Competition, Media, Question, Slide, Team, User


def image(filename, page=0, page_size=15, order=1, order_by=None):
    query = Media.query.filter(Media.type_id == 1)
    if filename:
        query = query.filter(Media.filename.like(f"%{filename}%"))

    return query.pagination(page, page_size, None, None)


def user(email=None, name=None, city_id=None, role_id=None, page=0, page_size=15, order=1, order_by=None):
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

    return query.pagination(page, page_size, order_column, order)


def competition(name=None, year=None, city_id=None, page=0, page_size=15, order=1, order_by=None):
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

    return query.pagination(page, page_size, order_column, order)


def slide(slide_order=None, title=None, body=None, competition_id=None, page=0, page_size=15, order=1, order_by=None):
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

    return query.pagination(page, page_size, order_column, order)


def questions(
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
        query = query.join(Slide, (Slide.competition_id == competition_id) & (Slide.id == Question.slide_id))

    order_column = Question.id  # Default order_by
    if order_by:
        order_column = getattr(Question.__table__.c, order_by)

    return query.pagination(page, page_size, order_column, order)
