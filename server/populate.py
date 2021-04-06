import app.core.controller as dbc
from app import create_app, db
from app.core.models import City, MediaType, QuestionType, Role, Style, User


def _add_items():
    media_types = ["Image", "Video"]
    question_types = ["Boolean", "Multiple", "Text"]
    roles = ["Admin", "Editor"]
    cities = ["Linköping"]

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

    # Add deafult style
    db.session.add(Style("Main Style", ""))

    # Commit changes to db
    db.session.commit()

    # Add user with role and city
    dbc.add.default(User("test@test.se", "password", 1, 1))

    db.session.flush()


app = create_app("configmodule.DevelopmentConfig")

with app.app_context():
    db.create_all()
    _add_items()
