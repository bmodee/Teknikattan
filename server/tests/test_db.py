import app.core.controller as dbc
from app.core.models import City, Competition, Media, MediaType, Question, QuestionType, Role, Slide, Team, User

from tests import app, client, db
from tests.test_helpers import add_default_values, assert_exists, assert_insert_fail


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


def test_media(client):
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


def test_question(client):
    add_default_values()
    item_user = User.query.filter_by(email="test@test.se").first()

    # Get image type
    image_type = MediaType.query.filter_by(name="Image").first()

    # Add image
    db.session.add(Media("bild.png", image_type.id, item_user.id))
    db.session.commit()
    item_media = Media.query.filter_by(filename="bild.png").first()

    # Add competition
    item_city = City.query.filter_by(name="Linköping").first()
    dbc.add.competition("teknik8", 2020, item_city.id)
    dbc.add.competition("teknik9", 2020, item_city.id)
    item_competition = Competition.query.filter_by(name="teknik8").first()
    item_competition_2 = Competition.query.filter_by(name="teknik9").first()

    assert item_competition is not None
    assert item_competition.id == 4
    assert item_competition.city.name == "Linköping"

    # Add teams
    dbc.add.team("Lag1", item_competition)
    dbc.add.team("Lag2", item_competition)

    assert_insert_fail(Team, "Lag1", item_competition.id)

    dbc.add.team("Lag1", item_competition_2)

    assert Team.query.filter((Team.competition_id == item_competition.id) & (Team.name == "Lag1")).count() == 1
    assert Team.query.filter((Team.competition_id == item_competition.id) & (Team.name == "Lag2")).count() == 1
    assert Team.query.filter((Team.competition_id == item_competition_2.id) & (Team.name == "Lag1")).count() == 1
    assert Team.query.filter(Team.name == "Lag1").count() == 2
    assert Team.query.filter(Team.competition_id == item_competition.id).count() == 2
    assert Team.query.count() == 3

    # Add slides
    dbc.add.slide(item_competition)
    dbc.add.slide(item_competition)
    dbc.add.slide(item_competition)

    # Try add slide with same order
    assert_insert_fail(Slide, 1, item_competition.id)
    assert_exists(Slide, 3, order=1)

    item_slide1 = Slide.query.filter_by(order=0).first()
    item_slide2 = Slide.query.filter_by(order=1).first()
    item_slide3 = Slide.query.filter_by(order=2).first()

    assert item_slide1 is not None
    assert item_slide2 is not None
    assert item_slide3 is not None

    # Add questions
    question_type_bool = QuestionType.query.filter_by(name="Boolean").first()
    question_type_multiple = QuestionType.query.filter_by(name="Multiple").first()

    dbc.add.question("Fråga1", 10, question_type_bool.id, item_slide2)
    dbc.add.question("Fråga2", 10, question_type_multiple.id, item_slide3)

    assert question_type_bool is not None
    assert question_type_multiple is not None

    item_q1 = Question.query.filter_by(name="Fråga1").first()
    item_q2 = Question.query.filter_by(name="Fråga2").first()
    assert item_q1.type.name == "Boolean"
    assert item_q2.type.name == "Multiple"

    # Get question
    CID = 3
    QID = 4
    item_q1 = dbc.get.question(CID, QID)
    assert item_q1.id == QID
    item_slide = dbc.get.slide(CID, item_q1.slide_id)
    assert item_q1.slide_id == item_slide.id

    # Edit question
    print(item_q1.type_id)
    print(item_q1.slide_id)
    name = "Nytt namn"
    total_score = 44
    type_id = 2
    slide_id = 4
    dbc.edit.question(item_q1, name=name, total_score=total_score, type_id=type_id, slide_id=slide_id)
    item_q1 = Question.query.filter_by(name=name).first()
    assert item_q1.name == name
    assert item_q1.total_score == total_score
    assert item_q1.type_id == type_id
    assert item_q1.slide_id == slide_id

    # Search for question
    item_q2, _ = dbc.get.search_questions(
        name=name, total_score=total_score, type_id=type_id, slide_id=slide_id, competition_id=CID
    )
    assert item_q1 == item_q2[0]


def test_slide(client):
    add_default_values()

    # Get all slides
    slides = Slide.query.all()
    item_slides = dbc.get.search_slide()
    assert slides == item_slides[0]

    # Search using all parameters
    item_comp = Competition.query.filter(Competition.name == "Tävling 1").first()
    aux = dbc.get.search_slide(slide_order=1, title="Title 1", body="Body 1", competition_id=item_comp.id)
    item_slide = aux[0][0]
    assert item_comp.slides[1] == item_slide

    # Edit all parameters of a slide
    title = "Ändrad titel"
    timer = 42
    slide_id = item_slide.id
    dbc.edit.slide(item_slide, title=title, timer=timer)
    aux = dbc.get.search_slide(slide_order=1, title=title, body="Body 1", competition_id=item_comp.id)
    item_slide = aux[0][0]
    assert item_slide.id == slide_id
    assert item_slide.title == title
    assert item_slide.timer == timer

    # Delete slide
    aux = dbc.get.search_slide(slide_order=1, competition_id=item_comp.id)
    item_slide = aux[0][0]
    dbc.delete.slide(item_slide)
