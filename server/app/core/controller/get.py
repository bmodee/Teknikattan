from app.core.models import Competition, User


def search_user(email=None, name=None, city=None, role=None, page=1, page_size=15):
    query = User.query
    if name:
        query = query.filter(User.name.like(f"%{name}%"))
    if email:
        query = query.filter(User.email.like(f"%{email}%"))
    if city:
        query = query.filter(User.city.name == city)
    if role:
        query = query.filter(User.role.name == role)

    query = query.limit(page_size).offset(page * page_size)

    return query.all()


def search_competitions(name=None, year=None, city_id=None, style_id=None, page=1, page_size=15):
    query = Competition.query
    if name:
        query = query.filter(Competition.name.like(f"%{name}%"))
    if year:
        query = query.filter(Competition.year == year)
    if city_id:
        query = query.filter(Competition.city_id == city_id)
    if style_id:
        query = query.filter(Competition.style_id == style_id)

    query = query.limit(page_size).offset(page * page_size)

    return query.all()
