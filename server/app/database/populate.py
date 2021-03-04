from app import db
from app.database.controller import add_user
from app.database.models import City, MediaType, QuestionType, Role

media_types = ["Image", "Video"]
question_types = ["Boolean", "Multiple", "Text"]
roles = ["Admin", "Editor"]
cities = ["Linköping"]


def add_default_values():

    # Add media types
    for type in media_types:
        db.session.add(MediaType(type))

    # Add question types
    for type in question_types:
        db.session.add(QuestionType(type))

    # Add roles
    for role in roles:
        db.session.add(Role(role))

    # Add cities
    for city in cities:
        db.session.add(City(city))

    # Commit changes to db
    db.session.commit()

    # Add user with role and city
    add_user("test@test.se", "password", "Admin", "Linköping")
    db.session.commit()
