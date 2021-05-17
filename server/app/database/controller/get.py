"""
This file contains functionality to get data from the database.
"""

from app.core import db
from app.core import http_codes as codes
from app.database.models import (
    Code,
    Competition,
    Component,
    ImageComponent,
    Question,
    QuestionAlternative,
    QuestionAlternativeAnswer,
    QuestionScore,
    Slide,
    Team,
    TextComponent,
    User,
)
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from sqlalchemy.orm.util import with_polymorphic


def all(db_type):
    """ Gets a list of all lazy db-items in the provided table. """

    return db_type.query.all()


def one(db_type, id, required=True):
    """ Get lazy db-item in the table that has the same id. """

    return db_type.query.filter(db_type.id == id).first_extended(required=required)


### Codes ###
def code_by_code(code):
    """ Gets the code object associated with the provided code. """

    return Code.query.filter(Code.code == code.upper()).first_extended(
        True, "A presentation with that code does not exist"
    )


def code_list(competition_id):
    """
    Gets a list of all code objects associated with the provided competition.
    """

    # team_view_id = 1
    join_competition = Competition.id == Code.competition_id
    filters = Competition.id == competition_id
    return Code.query.join(Competition, join_competition).filter(filters).all()


### Users ###
def user_exists(email):
    """ Checks if an user has that email. """

    return User.query.filter(User.email == email).count() > 0


def user_by_email(email):
    """ Gets the user object associated with the provided email. """

    return User.query.filter(User.email == email).first_extended(error_code=codes.UNAUTHORIZED)


### Slides ###
def slide(competition_id, slide_id):
    """
    Gets the slide object associated with the provided competition and slide.
    """

    join_competition = Competition.id == Slide.competition_id
    filters = (Competition.id == competition_id) & (Slide.id == slide_id)

    return Slide.query.join(Competition, join_competition).filter(filters).first_extended()


def slide_list(competition_id):
    """
    Gets a list of all slide objects associated with the provided competition.
    """

    join_competition = Competition.id == Slide.competition_id
    filters = Competition.id == competition_id

    return Slide.query.join(Competition, join_competition).filter(filters).all()


def slide_count(competition_id):
    """ Gets the number of slides in the provided competition. """

    return Slide.query.filter(Slide.competition_id == competition_id).count()


### Teams ###
def team(competition_id, team_id):
    """ Gets the team object associated with the competition and team. """

    join_competition = Competition.id == Team.competition_id
    filters = (Competition.id == competition_id) & (Team.id == team_id)

    return Team.query.join(Competition, join_competition).filter(filters).first_extended()


def team_list(competition_id):
    """
    Gets a list of all team objects associated with the provided competition.
    """

    join_competition = Competition.id == Team.competition_id
    filters = Competition.id == competition_id

    return Team.query.join(Competition, join_competition).filter(filters).all()


### Questions ###
def question(competition_id, slide_id, question_id):
    """
    Gets the question object associated with the
    provided, competition, slide and question.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Question.slide_id
    filters = (Competition.id == competition_id) & (Slide.id == slide_id) & (Question.id == question_id)

    return Question.query.join(Competition, join_competition).join(Slide, join_slide).filter(filters).first_extended()


def question_list(competition_id, slide_id):
    """
    Gets a list of all question objects associated
    with the provided competition and slide.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Question.slide_id
    filters = (Competition.id == competition_id) & (Slide.id == slide_id)

    return Question.query.join(Competition, join_competition).join(Slide, join_slide).filter(filters).all()


def question_list_for_competition(competition_id):
    """
    Gets a list of all question objects associated
    with the provided competition.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Question.slide_id
    filters = Competition.id == competition_id

    return Question.query.join(Competition, join_competition).join(Slide, join_slide).filter(filters).all()


### Question Alternative ###
def question_alternative(
    competition_id,
    slide_id,
    question_id,
    alternative_id,
):
    """
    Get a question alternative for a given question
    based on its competition, slide and question.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Question.slide_id
    join_question = Question.id == QuestionAlternative.question_id
    filters = (
        (Competition.id == competition_id)
        & (Slide.id == slide_id)
        & (Question.id == question_id)
        & (QuestionAlternative.id == alternative_id)
    )

    return (
        QuestionAlternative.query.join(Competition, join_competition)
        .join(Slide, join_slide)
        .join(Question, join_question)
        .filter(filters)
        .first_extended()
    )


def question_alternative_list(competition_id, slide_id, question_id):
    """
    Get a list of all question alternative objects for a
    given question based on its competition and slide.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Question.slide_id
    join_question = Question.id == QuestionAlternative.question_id
    filters = (Competition.id == competition_id) & (Slide.id == slide_id) & (Question.id == question_id)

    return (
        QuestionAlternative.query.join(Competition, join_competition)
        .join(Slide, join_slide)
        .join(Question, join_question)
        .filter(filters)
        .all()
    )


### Question Answers ###


def question_score(competition_id, team_id, question_id, required=True):
    """
    Get question answer for a given team based on its competition.
    """

    join_competition = Competition.id == Team.competition_id
    join_team = Team.id == QuestionScore.team_id
    filters = (Competition.id == competition_id) & (Team.id == team_id) & (QuestionScore.question_id == question_id)
    return (
        QuestionScore.query.join(Competition, join_competition)
        .join(Team, join_team)
        .filter(filters)
        .first_extended(required)
    )


def question_score_list(competition_id, team_id):
    """
    Get question answer for a given team based on its competition.
    """

    join_competition = Competition.id == Team.competition_id
    join_team = Team.id == QuestionScore.team_id
    filters = (Competition.id == competition_id) & (Team.id == team_id)
    return QuestionScore.query.join(Competition, join_competition).join(Team, join_team).filter(filters).all()


def question_alternative_answer(competition_id, team_id, question_alternative_id, required=True):
    """
    Get question answer for a given team based on its competition.
    """

    join_competition = Competition.id == Team.competition_id
    join_team = Team.id == QuestionAlternativeAnswer.team_id
    filters = (
        (Competition.id == competition_id)
        & (Team.id == team_id)
        & (QuestionAlternativeAnswer.question_alternative_id == question_alternative_id)
    )
    return (
        QuestionAlternativeAnswer.query.join(Competition, join_competition)
        .join(Team, join_team)
        .filter(filters)
        .first_extended(required)
    )


def question_alternative_answer_list(competition_id, team_id):
    """
    Get a list of question answers for a given team based on its competition.
    """

    join_competition = Competition.id == Team.competition_id
    join_team = Team.id == QuestionAlternativeAnswer.team_id
    filters = (Competition.id == competition_id) & (Team.id == team_id)
    query = QuestionAlternativeAnswer.query.join(Competition, join_competition).join(Team, join_team).filter(filters)
    # Get total score
    # sum = query.with_entities(func.sum(QuestionAnswer.score)).all()
    items = query.all()
    return items


### Components ###
def component(competition_id, slide_id, component_id):
    """
    Gets a component object associated with
    the provided competition id and slide order.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Component.slide_id
    filters = (Competition.id == competition_id) & (Slide.id == slide_id) & (Component.id == component_id)

    poly = with_polymorphic(Component, [TextComponent, ImageComponent])
    return (
        db.session.query(poly)
        .join(Competition, join_competition)
        .join(Slide, join_slide)
        .filter(filters)
        .first_extended()
    )


def component_list(competition_id, slide_id):
    """
    Gets a list of all component objects associated with
    the provided competition and slide.
    """

    join_competition = Competition.id == Slide.competition_id
    join_slide = Slide.id == Component.slide_id
    filters = (Competition.id == competition_id) & (Slide.id == slide_id)
    return Component.query.join(Competition, join_competition).join(Slide, join_slide).filter(filters).all()


### Competitions ###
def competition(competition_id):
    """ Get Competition and all it's sub-entities. """

    os1 = joinedload(Competition.slides).joinedload(Slide.components)
    os2 = joinedload(Competition.slides).joinedload(Slide.questions).joinedload(Question.alternatives)
    ot = joinedload(Competition.teams).joinedload(Team.question_alternative_answers)
    ot1 = joinedload(Competition.teams).joinedload(Team.question_scores)
    return (
        Competition.query.filter(Competition.id == competition_id)
        .options(os1)
        .options(os2)
        .options(ot)
        .options(ot1)
        .first()
    )
