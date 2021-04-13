from app.database.models import Competition, Question, Slide, Team, User
from sqlalchemy.sql.expression import outerjoin


def user_exists(email):
    return User.query.filter(User.email == email).count() > 0


def competition(CID, required=True, error_msg=None):
    return Competition.query.filter(Competition.id == CID).first_extended(required, error_msg)


def user(UID, required=True, error_msg=None):
    return User.query.filter(User.id == UID).first_extended(required, error_msg)


def user_by_email(email, required=True, error_msg=None):
    return User.query.filter(User.email == email).first_extended(required, error_msg)


def slide_by_order(CID, order, required=True, error_msg=None):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.order == order)).first_extended(
        required, error_msg
    )


def slide(CID, SID, required=True, error_msg=None):
    return Slide.query.filter((Slide.competition_id == CID) & (Slide.id == SID)).first_extended(required, error_msg)


def team(CID, TID, required=True, error_msg=None):
    return Team.query.filter((Team.competition_id == CID) & (Team.id == TID)).first_extended(required, error_msg)


def question(CID, QID, required=True, error_msg=None):
    return (
        Question.query.join(Slide, (Slide.competition_id == CID) & (Slide.id == Question.slide_id))
        .filter(Question.id == QID)
        .first_extended(required, error_msg)
    )


def question_list(CID):
    return Question.query.join(Slide, (Slide.competition_id == CID) & (Slide.id == Question.slide_id)).all()


def team_list(CID):
    return Team.query.filter(Team.competition_id == CID).all()


def slide_list(CID):
    return Slide.query.filter(Slide.competition_id == CID).all()


def slide_count(CID):
    return Slide.query.filter(Slide.competition_id == CID).count()
