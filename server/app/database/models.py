"""
This file contains every model in the database. In regular SQL terms, it 
defines every table, the fields in those tables and their relationship to 
each other.
"""

from app.core import bcrypt, db
from app.database.types import (IMAGE_COMPONENT_ID, QUESTION_COMPONENT_ID,
                                TEXT_COMPONENT_ID)
from sqlalchemy.ext.hybrid import hybrid_method, hybrid_property
from sqlalchemy.orm import backref

STRING_SIZE = 254  # Default size of string Columns (varchar)


class Whitelist(db.Model):
    """
    Table with allowed jwt.

    Depend on table: User, Competition.
    """

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=True)

    def __init__(self, jti, user_id=None, competition_id=None):
        self.jti = jti
        self.user_id = user_id
        self.competition_id = competition_id


class Blacklist(db.Model):
    """
    Table with banned jwt.
    """

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, unique=True)

    def __init__(self, jti):
        self.jti = jti


class Role(db.Model):
    """
    Table with roles: Admin and Editor.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="role")

    def __init__(self, name):
        self.name = name


class City(db.Model):
    """
    Table with cities.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="city")
    competitions = db.relationship("Competition", backref="city")

    def __init__(self, name):
        self.name = name


class User(db.Model):
    """
    Table with users.

    Depend on table: Role, City.
    """

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(STRING_SIZE), unique=True)
    name = db.Column(db.String(STRING_SIZE), nullable=True)

    _password = db.Column(db.LargeBinary(60), nullable=False)

    authenticated = db.Column(db.Boolean, default=False)

    login_attempts = db.Column(db.Integer, nullable=False, default=0)
    locked = db.Column(db.DateTime(timezone=False), nullable=True, default=None)

    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=False)

    media = db.relationship("Media", backref="upload_by")

    def __init__(self, email, plaintext_password, role_id, city_id, name=None):
        self._password = bcrypt.generate_password_hash(plaintext_password)
        self.email = email
        self.role_id = role_id
        self.city_id = city_id
        self.authenticated = False
        self.name = name

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def set_password(self, plaintext_password):
        self._password = bcrypt.generate_password_hash(plaintext_password)

    @hybrid_method
    def is_correct_password(self, plaintext_password):
        return bcrypt.check_password_hash(self._password, plaintext_password)


class Media(db.Model):
    """
    Table with media objects that can be image or video depending on type_id.

    Depend on table: MediaType, User.
    """

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(STRING_SIZE), unique=True)
    type_id = db.Column(db.Integer, db.ForeignKey("media_type.id"), nullable=False)
    upload_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    image_components = db.relationship("ImageComponent", backref="media")
    competition_background_images = db.relationship("Competition", backref="background_image")
    slide_background_images = db.relationship("Slide", backref="background_image")

    def __init__(self, filename, type_id, upload_by_id):
        self.filename = filename
        self.type_id = type_id
        self.upload_by_id = upload_by_id


class Competition(db.Model):
    """
    Table with competitions.

    Depend on table: Media, City.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    year = db.Column(db.Integer, nullable=False, default=2020)
    font = db.Column(db.String(STRING_SIZE), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=False)

    background_image_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)

    slides = db.relationship("Slide", backref="competition")
    teams = db.relationship("Team", backref="competition")
    codes = db.relationship("Code", backref="competition")

    def __init__(self, name, year, city_id):
        self.name = name
        self.year = year
        self.city_id = city_id
        self.font = "Calibri"


class Team(db.Model):
    """
    Table with teams.

    Depend on table: Competition.
    """

    __table_args__ = (db.UniqueConstraint("competition_id", "name"),)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), nullable=False)
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    question_alternative_answers = db.relationship("QuestionAlternativeAnswer", backref="team")
    question_scores = db.relationship("QuestionScore", backref="team")

    code = db.relationship("Code", backref="team")

    def __init__(self, name, competition_id):
        self.name = name
        self.competition_id = competition_id


class Slide(db.Model):
    """
    Table with slides.

    Depend on table: Competition, Media.
    """

    __table_args__ = (db.UniqueConstraint("order", "competition_id"),)
    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(STRING_SIZE), nullable=False, default="")
    body = db.Column(db.Text, nullable=False, default="")
    timer = db.Column(db.Integer, nullable=True)
    settings = db.Column(db.Text, nullable=False, default="{}")
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    background_image_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)

    components = db.relationship("Component", backref="slide")
    questions = db.relationship("Question", backref="questions")

    def __init__(self, order, competition_id):
        self.order = order
        self.competition_id = competition_id


class Question(db.Model):
    """
    Table with questions of different types depending on type_id

    Depend on table: QuestionType, Slide.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), nullable=False)
    total_score = db.Column(db.Integer, nullable=True, default=None)
    type_id = db.Column(db.Integer, db.ForeignKey("question_type.id"), nullable=False)
    slide_id = db.Column(db.Integer, db.ForeignKey("slide.id"), nullable=False)
    correcting_instructions = db.Column(db.Text, nullable=True, default=None)

    alternatives = db.relationship("QuestionAlternative", backref="question")

    def __init__(self, name, total_score, type_id, slide_id, correcting_instructions):
        self.name = name
        self.total_score = total_score
        self.type_id = type_id
        self.slide_id = slide_id
        self.correcting_instructions = correcting_instructions


class QuestionAlternative(db.Model):
    """
    Table with question alternatives.

    Depend on table: Question.
    """
    __table_args__ = (
        db.UniqueConstraint("question_id", "alternative_order"),
        db.UniqueConstraint("question_id", "correct_order"),
    )

    id = db.Column(db.Integer, primary_key=True)
    alternative = db.Column(db.String(STRING_SIZE), nullable=False)
    alternative_order = db.Column(db.Integer)
    correct = db.Column(db.String(STRING_SIZE), nullable=False)
    correct_order = db.Column(db.Integer)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    def __init__(self, alternative, alternative_order, correct, correct_order, question_id):
        self.alternative = alternative
        self.alternative_order = alternative_order
        self.correct = correct
        self.correct_order = correct_order
        self.question_id = question_id


class QuestionScore(db.Model):
    """
    Table with question answers.

    Depend on table: Question, Team.

    Unique Constraint: Question.id, Team.id.
    """

    __table_args__ = (db.UniqueConstraint("question_id", "team_id"),)
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=True, default=0)

    question_id = db.Column(db.Integer, db.ForeignKey("question_alternative.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=False)

    def __init__(self, score, question_id, team_id):
        self.score = score
        self.question_id = question_id
        self.team_id = team_id


class QuestionAlternativeAnswer(db.Model):
    __table_args__ = (db.UniqueConstraint("question_alternative_id", "team_id"),)
    id = db.Column(db.Integer, primary_key=True)
    answer = db.Column(db.String(STRING_SIZE), nullable=False)

    question_alternative_id = db.Column(db.Integer, db.ForeignKey("question_alternative.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=False)

    def __init__(self, answer, question_alternative_id, team_id):
        self.answer = answer
        self.question_alternative_id = question_alternative_id
        self.team_id = team_id


class Component(db.Model):
    """
    Table implemented with single table inheritance where each subclass is linked to a specific type_id
    This class/table contains all fields from every subclass.

    Depend on table: :ViewType, Slide, ComponentType, Media, Question.
    """

    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer, nullable=False, default=0)
    y = db.Column(db.Integer, nullable=False, default=0)
    w = db.Column(db.Integer, nullable=False, default=1)
    h = db.Column(db.Integer, nullable=False, default=1)
    view_type_id = db.Column(db.Integer, db.ForeignKey("view_type.id"), nullable=True)
    slide_id = db.Column(db.Integer, db.ForeignKey("slide.id"), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("component_type.id"), nullable=False)

    __mapper_args__ = {"polymorphic_on": type_id}

    def __init__(self, slide_id, type_id, view_type_id, x=0, y=0, w=1, h=1):
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.slide_id = slide_id
        self.type_id = type_id
        self.view_type_id = view_type_id


class TextComponent(Component):
    """
    Subclass of Component that contains text.
    """

    text = db.Column(db.Text, default="", nullable=False)

    # __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": TEXT_COMPONENT_ID}


class ImageComponent(Component):
    """
    Subclass of Component that contains an image.

    Depend on table: Media.
    """

    media_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)

    # __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": IMAGE_COMPONENT_ID}


class QuestionComponent(Component):
    """
    Subclass of Component that contains a question.

    Depend on table: Question.
    """

    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=True)

    # __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": QUESTION_COMPONENT_ID}


class Code(db.Model):
    """
    Table with codes.

    Depend on table: ViewType, Competition, Team.
    """

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Text, unique=True)
    view_type_id = db.Column(db.Integer, db.ForeignKey("view_type.id"), nullable=False)
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=True)

    view_type = db.relationship("ViewType", uselist=False)

    def __init__(self, code, view_type_id, competition_id=None, team_id=None):
        self.code = code
        self.view_type_id = view_type_id
        self.competition_id = competition_id
        self.team_id = team_id


class ViewType(db.Model):
    """
    Table with view types: Team, Judge, Audience and Operator.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    def __init__(self, name):
        self.name = name


class ComponentType(db.Model):
    """
    Table with component types: Text, Image and Question.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    components = db.relationship("Component", backref="component_type")

    def __init__(self, name):
        self.name = name


class MediaType(db.Model):
    """
    Table with media types: Image and Video.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    media = db.relationship("Media", backref="type")

    def __init__(self, name):
        self.name = name


class QuestionType(db.Model):
    """
    Table with question types: Text, Practical, Multiple and Single.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    questions = db.relationship("Question", backref="type")

    def __init__(self, name):
        self.name = name
