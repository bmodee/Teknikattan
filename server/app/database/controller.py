from app import db
from app.database.models import City, Role, User


def add_user(email, plaintext_password, role, city):
    item_role = Role.query.filter_by(name=role).first()
    item_city = City.query.filter_by(name=city).first()
    user = User(email, plaintext_password, item_role.id, item_city.id)
    db.session.add(user)
