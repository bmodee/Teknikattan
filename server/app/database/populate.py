import app.database.controller as dbc
from app import db
from app.database.models import City, MediaType, QuestionType, Role

media_types = ["Image", "Video"]
question_types = ["Boolean", "Multiple", "Text"]
roles = ["Admin", "Editor"]
cities = ["Linköping"]


def add_default_values():

    # Add media types
    for item in media_types:
        db.session.add(MediaType(item))

    # Add question types
    for item in question_types:
        db.session.add(QuestionType(item))

    # Add roles
    for item in roles:
        db.session.add(Role(item))

    # Add cities
    for item in cities:
        db.session.add(City(item))

    # Commit changes to db
    db.session.commit()

    # Add user with role and city
    dbc.add.user("test@test.se", "password", "Admin", "Linköping")
