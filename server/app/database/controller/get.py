from app.core import db
from app.database.models import (City, Code, Competition, Component,
                                 ComponentType, MediaType, Question,
                                 QuestionType, Role, Slide, Team, User,
                                 ViewType)


def all(db_type):
    return db_type.query.all()


def one(db_type, id, required=True, error_msg=None):
    return db_type.query.filter(db_type.id == id).first_extended(required, error_msg)


def user_exists(email):
    return User.query.filter(User.email == email).count() > 0

def code_by_code(code):
    return Code.query.filter(Code.code == code.upper()).first()


def user(UID, required=True, error_msg=None):
    return User.query.filter(User.id == UID).first_extended(required, error_msg)


def user_by_email(email, required=True, error_msg=None):
    return User.query.filter(User.email == email).first_extended(required, error_msg)


def slide(CID, SOrder, required=True, error_msg=None):
    filters = (Slide.competition_id == CID) & (Slide.order == SOrder)
    return Slide.query.filter(filters).first_extended(required, error_msg)


def team(CID, TID, required=True, error_msg=None):
    return Team.query.filter((Team.competition_id == CID) & (Team.id == TID)).first_extended(required, error_msg)


def question(CID, SOrder, QID, required=True, error_msg=None):
    join_filters = (Slide.competition_id == CID) & (Slide.order == SOrder) & (Slide.id == Question.slide_id)
    return Question.query.join(Slide, join_filters).filter(Question.id == QID).first_extended(required, error_msg)



def code_list(competition_id):
    team_view_id = 1
    join_filters = (Code.view_type_id == team_view_id) & (Team.id == Code.pointer)
    filters = ((Code.view_type_id != team_view_id) & (Code.pointer == competition_id))(
        (Code.view_type_id == team_view_id) & (competition_id == Team.competition_id)
    )
    return Code.query.join(Team, join_filters, isouter=True).filter(filters).all()


def question_list(CID):
    join_filters = (Slide.competition_id == CID) & (Slide.id == Question.slide_id)
    return Question.query.join(Slide, join_filters).all()


def component_list(CID, SOrder):
    join_filters = (Slide.competition_id == CID) & (Slide.order == SOrder) & (Component.slide_id == Slide.id)
    return Component.query.join(Slide, join_filters).all()


def team_list(CID):
    return Team.query.filter(Team.competition_id == CID).all()


def slide_list(CID):
    return Slide.query.filter(Slide.competition_id == CID).all()


def slide_count(CID):
    return Slide.query.filter(Slide.competition_id == CID).count()
