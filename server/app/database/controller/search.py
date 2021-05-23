"""
This file contains functionality to find data to the database.
"""

from app.database.models import Competition, Media, Question, Slide, User


def image(pagination_parameters=None, filename=None, order=1, order_by=None):
    """ Finds and returns an image from the file name. """

    query = Media.query.filter(Media.type_id == 1)
    if filename:
        query = query.filter(Media.filename.like(f"%{filename}%"))

    return query.paginate_api(pagination_parameters)


def user(
    pagination_parameters=None,
    email=None,
    name=None,
    city_id=None,
    role_id=None,
):
    """ Finds and returns any number of users from the provided parameters. """

    query = User.query
    if name:
        query = query.filter(User.name.like(f"%{name}%"))
    if email:
        query = query.filter(User.email.like(f"%{email}%"))
    if city_id:
        query = query.filter(User.city_id == city_id)
    if role_id:
        query = query.filter(User.role_id == role_id)

    return query.paginate_api(pagination_parameters)


def competition(
    pagination_parameters=None,
    name=None,
    year=None,
    city_id=None,
):
    """ Finds and returns a competition from the provided parameters. """

    query = Competition.query
    if name:
        query = query.filter(Competition.name.like(f"%{name}%"))
    if year:
        query = query.filter(Competition.year == year)
    if city_id:
        query = query.filter(Competition.city_id == city_id)

    return query.paginate_api(pagination_parameters)


def slide(
    pagination_paramters=None,
    slide_order=None,
    title=None,
    body=None,
    competition_id=None,
    order_by=None,
):
    """ Finds and returns a slide from the provided parameters. """

    query = Slide.query
    if slide_order:
        query = query.filter(Slide.order == slide_order)
    if title:
        query = query.filter(Slide.title.like(f"%{title}%"))
    if body:
        query = query.filter(Slide.body.like(f"%{body}%"))
    if competition_id:
        query = query.filter(Slide.competition_id == competition_id)

    return query.paginate_api(pagination_paramters)


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
    """ Finds and returns a question from the provided parameters. """

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
        query = query.join(
            Slide,
            (Slide.competition_id == competition_id) & (Slide.id == Question.slide_id),
        )

    order_column = Question.id  # Default order_by
    if order_by:
        order_column = getattr(Question.__table__.c, order_by)

    return query.pagination(page, page_size, order_column, order)
