"""
This file tests the database controller functions.
"""

import app.database.controller as dbc
import pytest
from app.database.models import (
    City,
    Code,
    Competition,
    Media,
    MediaType,
    Question,
    QuestionAlternative,
    QuestionAlternativeAnswer,
    QuestionScore,
    Role,
    Slide,
    Team,
    User,
)

from tests import DISABLE_TESTS, app, client, db
from tests.test_helpers import (
    add_default_values,
    assert_all_slide_orders,
    assert_insert_fail,
    assert_should_fail,
    assert_slide_order,
)


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_default_values(client):
    add_default_values()

    # Basic funcs
    def func(val):
        assert val

    # Testing assert_should_fail when it should and should not fail
    assert_should_fail(func, False)

    try:
        assert_should_fail(func, True)
    except:
        pass
    else:
        assert False

    # All slides should be in order
    assert_all_slide_orders()

    # Slides are moved so they are not in correct order
    item_slides = dbc.get.all(Slide)
    for item_slide in item_slides:
        item_slide.order += 10
        db.session.add(item_slide)
    db.session.commit()

    # The slides are not in order so the assert should fail
    assert_should_fail(assert_all_slide_orders)


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is enabled")
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


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is enabled")
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


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is enabled")
def test_copy(client):
    add_default_values()

    # Fetches a competition
    list_item_competitions = dbc.search.competition(name="Tävling 1")
    item_competition_original = list_item_competitions[0]

    # Fetches the first slide in that competition
    num_slides = 3
    item_slides = dbc.search.slide(competition_id=item_competition_original.id)
    assert len(item_slides) == num_slides
    item_slide_original = item_slides[1]

    dbc.delete.slide(item_slides[0])
    num_slides -= 1

    # Inserts several copies of the same slide
    num_copies = 3
    for _ in range(num_copies):
        # Slide must contain some of these things to copy
        assert len(item_slide_original.components) > 0
        assert len(item_slide_original.questions) > 0
        assert len(item_slide_original.questions[0].alternatives) > 0

        item_slide_copy = dbc.copy.slide(item_slide_original)
        num_slides += 1

        check_slides_copy(item_slide_original, item_slide_copy, num_slides, num_slides - 1)
        assert item_slide_copy.competition_id == item_slide_original.competition_id

    # Copies competition
    num_copies = 3
    for _ in range(num_copies):
        item_competition_copy = dbc.copy.competition(item_competition_original)
        assert len(item_competition_copy.slides) > 0
        for order, item_slide in enumerate(item_competition_copy.slides):
            item_slide_original = item_competition_original.slides[order]
            check_slides_copy(item_slide_original, item_slide, num_slides, order)
            assert item_slide.competition_id != item_slide_original.competition_id
            # TODO: Check that all codes are corectly created

    # Deleting competition deletes all corresponding codes
    item_competitions = dbc.get.all(Competition)
    for item_competition in item_competitions:
        dbc.delete.competition(item_competition)
    assert len(dbc.get.all(Code)) == 0

    # Deleting team deletes the right code
    item_competition = dbc.add.competition("tom", 1971, 1)
    item_team_1 = dbc.add.team("Lag 1", item_competition.id)
    item_team_2 = dbc.add.team("Lag 2", item_competition.id)
    assert len(dbc.get.all(Code)) == 5
    dbc.delete.team(item_team_1)
    assert len(dbc.get.all(Code)) == 4
    dbc.delete.team(item_team_2)
    assert len(dbc.get.all(Code)) == 3

    assert_all_slide_orders()


def check_slides_copy(item_slide_original, item_slide_copy, num_slides, order):
    """
    Checks that two slides are correct copies of each other.
    This function looks big but is quite fast.
    """
    assert item_slide_copy.order == order
    assert item_slide_copy.title == item_slide_original.title
    assert item_slide_copy.body == item_slide_original.body
    assert item_slide_copy.timer == item_slide_original.timer
    assert item_slide_copy.settings == item_slide_original.settings

    # Checks that all components were correctly copied
    components = item_slide_original.components
    components_copy = item_slide_copy.components
    assert len(components) == len(components_copy)

    for c1, c2 in zip(components, components_copy):
        assert c1 != c2
        assert c1.x == c2.x
        assert c1.y == c2.y
        assert c1.w == c2.w
        assert c1.h == c2.h
        assert c1.slide_id == item_slide_original.id
        assert c2.slide_id == item_slide_copy.id
        assert c1.type_id == c2.type_id
        if c1.type_id == 1:
            assert c1.text == c2.text
        elif c1.type_id == 2:
            assert c1.image_id == c2.image_id

    # Checks that all questions were correctly copied
    questions = item_slide_original.questions
    questions_copy = item_slide_copy.questions
    assert len(questions) == len(questions_copy)

    for q1, q2 in zip(questions, questions_copy):
        assert q1 != q2
        assert q1.name == q2.name
        assert q1.total_score == q2.total_score
        assert q1.type_id == q2.type_id
        assert q1.slide_id == item_slide_original.id
        assert q2.slide_id == item_slide_copy.id

        # Assert alternatives
        alternatives = q1.alternatives
        alternatives_copy = q2.alternatives
        assert len(alternatives) == len(alternatives_copy)

        for a1, a2 in zip(alternatives, alternatives_copy):
            assert a1.alternative == a2.alternative
            assert a1.alternative_order == a2.alternative_order
            assert a1.correct == a2.correct
            assert a1.correct_order == a2.correct_order
            assert a1.question_id == q1.id
            assert a2.question_id == q2.id

    # Checks that the copy put the slide in the database
    item_slides = dbc.search.slide(
        competition_id=item_slide_copy.competition_id,
        # page_size=num_slides + 1, # Use this total > 15
    )
    assert len(item_slides) == num_slides
    assert item_slide_copy == item_slides[order]


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is enabled")
def test_move_slides(client):
    add_default_values()

    item_comp = dbc.get.one(Competition, 1)

    for _ in range(9):
        dbc.add.slide(item_comp.id)

    # Move from beginning to end
    dbc.utils.move_order(item_comp.slides, "order", 0, 9)
    dbc.utils.refresh(item_comp)
    assert_slide_order(item_comp, [9, 0, 1, 2, 3, 4, 5, 6, 7, 8])

    # Move from end to beginning
    dbc.utils.move_order(item_comp.slides, "order", 9, 0)
    dbc.utils.refresh(item_comp)
    assert_slide_order(item_comp, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

    # Move some things in the middle
    dbc.utils.move_order(item_comp.slides, "order", 3, 7)
    dbc.utils.refresh(item_comp)
    assert_slide_order(item_comp, [0, 1, 2, 7, 3, 4, 5, 6, 8, 9])

    dbc.utils.move_order(item_comp.slides, "order", 1, 5)
    dbc.utils.refresh(item_comp)
    assert_slide_order(item_comp, [0, 5, 1, 7, 2, 3, 4, 6, 8, 9])

    dbc.utils.move_order(item_comp.slides, "order", 8, 2)
    dbc.utils.refresh(item_comp)
    assert_slide_order(item_comp, [0, 6, 1, 8, 3, 4, 5, 7, 2, 9])


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is enabled")
def test_question(client):

    # Add competition
    dbc.add.competition("Tävling 1", 2021, 1)
    item_competition = Competition.query.filter(Competition.name == "Tävling 1").one()

    # Add two teams
    dbc.add.team("Lag 1", item_competition.id)
    dbc.add.team("Lag 2", item_competition.id)
    item_team_1 = Team.query.filter(Team.name == "Lag 1").one()
    item_team_2 = Team.query.filter(Team.name == "Lag 2").one()

    # Get default slide
    item_slide_1 = Slide.query.filter((Slide.competition_id == item_competition.id) & (Slide.order == 0)).one()

    # Add question to default slide
    dbc.add.question("Fråga 1", 10, 1, item_slide_1.id)
    item_question_1 = Question.query.filter(Question.name == "Fråga 1").one()
    dbc.edit.default(item_question_1, name="Ny fråga 1", correcting_instructions="Rättningsinstruktioner")

    # Add alternatives
    dbc.add.question_alternative(item_question_1.id)
    item_alterantive_1 = QuestionAlternative.query.filter(QuestionAlternative.question_id == item_question_1.id).one()

    # Add answers
    dbc.add.question_alternative_answer("Lag 1 svar 1", item_alterantive_1.id, item_team_1.id)
    dbc.add.question_alternative_answer("Lag 2 svar 1", item_alterantive_1.id, item_team_2.id)
    item_answer_1 = QuestionAlternativeAnswer.query.filter(QuestionAlternativeAnswer.answer == "Lag 1 svar 1").one()
    dbc.edit.default(item_answer_1, answer="5")

    # Add scores
    dbc.add.question_score(10, item_question_1.id, item_team_1.id)
    dbc.add.question_score(5, item_question_1.id, item_team_2.id)
    item_score_1 = QuestionScore.query.filter(
        (QuestionScore.question_id == item_question_1.id) & (QuestionScore.team_id == item_team_1.id)
    ).one()
    dbc.edit.default(item_score_1, score=5)


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is enabled")
def test_team(client):
    add_default_values()

    # All teams were added
    teams = Team.query.all()
    assert len(teams) == 4

    # Get team
    item_team1 = dbc.get.team(1, 1)
    assert item_team1.id == 1
    assert item_team1.name == "Lag 1"
    assert item_team1.competition.id == 1

    # Add team
    item_comp = Competition.query.filter(Competition.id == 2).one()
    no_teams = len(Team.query.all())
    item_team1 = dbc.add.team("Nytt lag", item_comp.id)
    no_teams += 1
    assert len(Team.query.all()) == no_teams
    item_team2 = dbc.get.team(2, item_team1.id)
    assert item_team1 == item_team2

    # Try to add same team again
    assert_insert_fail(Team, "Nytt lag", item_comp.id)
    assert len(Team.query.all()) == no_teams

    # Edit team
    name = "Helt nytt lag"
    item_team2 = dbc.edit.default(item_team1, name=name)
    assert item_team2.name == name
    assert item_team1 == item_team2

    # Delete team
    item_team = dbc.get.team(1, 1)
    dbc.delete.team(item_team)
