from app import db
from app.database.models import City, Competition, Role, Slide, Style, User


def user(email, plaintext_password, role, city):
    item_role = Role.query.filter(Role.name == role).first()
    item_city = City.query.filter(City.name == city).first()

    new_user = User(email, plaintext_password, item_role.id, item_city.id)
    db.session.add(new_user)
    db.session.commit()

    return User.query.filter(User.email == email).first()


def competition(name, style_id, city_id):
    db.session.add(Competition(name, style_id, city_id))
    db.session.commit()

    filters = (Competition.name == name) & (Competition.city_id == city_id)
    return Competition.query.filter(filters).first()


def slide(competition_id):
    # item_slides = Slide.query.filter(Slide.competition_id == competition_id).order_by(Slide.order).all()
    order = Slide.query.filter(Slide.competition_id == competition_id).count()
    db.session.add(Slide(order, competition_id))
    db.session.commit()

    filters = (Slide.order == order) & (Competition.competition_id == competition_id)
    return Slide.query.filter(filters).first()
