import app.database.controller as dbc
import pytest
from app.database.models import (
    City,
    Competition,
    Media,
    MediaType,
    Question,
    QuestionAnswer,
    QuestionType,
    Role,
    Slide,
    Style,
    Team,
    User,
)
from app.database.populate import add_default_values
from app.utils.test_helpers import assert_exists, assert_insert_fail, assert_object_values

from tests import app, client, db

# server/env/Scripts/pytest.exe --cov app server/tests/


def test_user(client):
    add_default_values()
    item_user = User.query.filter_by(email="test@test.se").first()

    # Assert user
    assert item_user is not None
    assert item_user.city.name == "Linköping"
    assert item_user.role.name == "Admin"

    item_role = Role.query.filter_by(name="Admin").first()
    item_city = City.query.filter_by(name="Linköping").first()

    # Assert user with role and city
    assert len(item_role.users) == 1 and item_role.users[0].id == item_user.id
    assert len(item_city.users) == 1 and item_city.users[0].id == item_user.id


def test_media_style(client):
    add_default_values()
    item_user = User.query.filter_by(email="test@test.se").first()

    # Get image type
    image_type = MediaType.query.filter_by(name="Image").first()

    # Add image
    db.session.add(Media("bild.png", image_type.id, item_user.id))
    db.session.commit()

    # Assert image
    item_media = Media.query.filter_by(filename="bild.png").first()
    assert item_media is not None
    assert len(item_user.media) == 1
    assert item_media.upload_by.email == "test@test.se"

    # Add style
    db.session.add(Style("template", "hej", item_media.id))
    db.session.commit()

    # Assert style
    item_style = Style.query.filter_by(name="template").first()
    assert item_style is not None
    assert len(item_media.styles) == 1
    assert item_style.bg_image.filename == "bild.png"

    # Assert lazy loading
    assert item_user.media[0].styles[0].name == "template"


def test_question(client):
    add_default_values()
    item_user = User.query.filter_by(email="test@test.se").first()

    # Get image type
    image_type = MediaType.query.filter_by(name="Image").first()

    # Add image
    db.session.add(Media("bild.png", image_type.id, item_user.id))
    db.session.commit()
    item_media = Media.query.filter_by(filename="bild.png").first()

    # Add style
    db.session.add(Style("template", "hej", item_media.id))
    db.session.commit()
    item_style = Style.query.filter_by(name="template").first()

    # Add competition
    item_city = City.query.filter_by(name="Linköping").first()
    db.session.add(Competition("teknik8", 2020, item_style.id, item_city.id))
    db.session.add(Competition("teknik9", 2020, item_style.id, item_city.id))
    db.session.commit()
    item_competition = Competition.query.filter_by(name="teknik8").first()
    item_competition_2 = Competition.query.filter_by(name="teknik9").first()

    assert item_competition is not None
    assert item_competition.id == 1
    assert item_competition.style.name == "template"
    assert item_competition.city.name == "Linköping"

    # Add teams
    db.session.add(Team("Lag1", item_competition.id))
    db.session.add(Team("Lag2", item_competition.id))
    db.session.commit()

    assert_insert_fail(Team, "Lag1", item_competition.id)

    db.session.add(Team("Lag1", item_competition_2.id))
    db.session.commit()

    assert Team.query.filter((Team.competition_id == item_competition.id) & (Team.name == "Lag1")).count() == 1
    assert Team.query.filter((Team.competition_id == item_competition.id) & (Team.name == "Lag2")).count() == 1
    assert Team.query.filter((Team.competition_id == item_competition_2.id) & (Team.name == "Lag1")).count() == 1
    assert Team.query.filter(Team.name == "Lag1").count() == 2
    assert Team.query.filter(Team.competition_id == item_competition.id).count() == 2
    assert Team.query.count() == 3

    # Add slides
    db.session.add(Slide(1, item_competition.id))
    db.session.add(Slide(2, item_competition.id))
    db.session.add(Slide(3, item_competition.id))
    db.session.commit()

    # Try add slide with same order
    assert_insert_fail(Slide, 1, item_competition.id)
    assert_exists(Slide, 1, order=1)

    item_slide1 = Slide.query.filter_by(order=1).first()
    item_slide2 = Slide.query.filter_by(order=2).first()
    item_slide3 = Slide.query.filter_by(order=3).first()

    assert item_slide1 is not None
    assert item_slide2 is not None
    assert item_slide3 is not None

    # Add questions
    question_type_bool = QuestionType.query.filter_by(name="Boolean").first()
    question_type_multiple = QuestionType.query.filter_by(name="Multiple").first()

    db.session.add(Question("Fråga1", 0, question_type_bool.id, item_slide2.id))
    db.session.add(Question("Fråga2", 1, question_type_multiple.id, item_slide3.id))
    db.session.commit()

    assert question_type_bool is not None
    assert question_type_multiple is not None

    item_q1 = Question.query.filter_by(name="Fråga1").first()
    item_q2 = Question.query.filter_by(name="Fråga2").first()
    assert item_q1.type.name == "Boolean"
    assert item_q2.type.name == "Multiple"
