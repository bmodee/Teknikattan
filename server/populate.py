import app.database.controller as dbc
from app import create_app, db
from app.database.models import City, MediaType, QuestionType, Role

user = {"email": "test@test.se", "password": "password", "role": "Admin", "city": "Linköping"}
media_types = ["Image", "Video"]
question_types = ["Boolean", "Multiple", "Text"]
roles = ["Admin", "Editor"]
cities = ["Linköping"]


def _add_items():
    # Add media types
    for item in media_types:
        db.session.add(MediaType(item))

    db.session.commit()

    # Add question types
    for item in question_types:
        db.session.add(QuestionType(item))
    db.session.commit()

    # Add roles
    for item in roles:
        db.session.add(Role(item))
    db.session.commit()

    # Add cities
    for item in cities:
        db.session.add(City(item))
    db.session.commit()

    # Add user with role and city
    dbc.add.user("test@test.se", "password", "Admin", "Linköping")

    db.session.flush()


app = create_app("configmodule.DevelopmentConfig")

with app.app_context():
    db.create_all()
    _add_items()
