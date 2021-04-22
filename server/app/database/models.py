from app.core import bcrypt, db
from app.database import Dictionary
from sqlalchemy.ext.hybrid import hybrid_method, hybrid_property

STRING_SIZE = 254


class Blacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, unique=True)
    expire_date = db.Column(db.Integer, nullable=True)

    def __init__(self, jti):
        self.jti = jti


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="role")

    def __init__(self, name):
        self.name = name


# TODO Region?
class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="city")
    competitions = db.relationship("Competition", backref="city")

    def __init__(self, name):
        self.name = name


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(STRING_SIZE), unique=True)
    name = db.Column(db.String(STRING_SIZE), nullable=True)

    _password = db.Column(db.LargeBinary(60), nullable=False)

    authenticated = db.Column(db.Boolean, default=False)
    # twoAuthConfirmed = db.Column(db.Boolean, default=True)
    # twoAuthCode = db.Column(db.String(STRING_SIZE), nullable=True)

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
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(STRING_SIZE), unique=True)
    type_id = db.Column(db.Integer, db.ForeignKey("media_type.id"), nullable=False)
    upload_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def __init__(self, filename, type_id, upload_by_id):
        self.filename = filename
        self.type_id = type_id
        self.upload_by_id = upload_by_id


class Competition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    year = db.Column(db.Integer, nullable=False, default=2020)
    font = db.Column(db.String(STRING_SIZE), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=False)
    background_image_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)

    slides = db.relationship("Slide", backref="competition")
    teams = db.relationship("Team", backref="competition")

    background_image = db.relationship("Media", uselist=False)

    def __init__(self, name, year, city_id):
        self.name = name
        self.year = year
        self.city_id = city_id
        self.font = "Calibri"


class Team(db.Model):
    __table_args__ = (db.UniqueConstraint("competition_id", "name"),)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), nullable=False)
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    question_answers = db.relationship("QuestionAnswer", backref="team")

    def __init__(self, name, competition_id):
        self.name = name
        self.competition_id = competition_id


class Slide(db.Model):
    __table_args__ = (db.UniqueConstraint("order", "competition_id"),)
    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(STRING_SIZE), nullable=False, default="")
    body = db.Column(db.Text, nullable=False, default="")
    timer = db.Column(db.Integer, nullable=False, default=0)
    settings = db.Column(db.Text, nullable=False, default="{}")
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    background_image_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)
    background_image = db.relationship("Media", uselist=False)

    components = db.relationship("Component", backref="slide")
    questions = db.relationship("Question", backref="questions")

    def __init__(self, order, competition_id):
        self.order = order
        self.competition_id = competition_id


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), nullable=False)
    total_score = db.Column(db.Integer, nullable=False, default=1)
    type_id = db.Column(db.Integer, db.ForeignKey("question_type.id"), nullable=False)
    slide_id = db.Column(db.Integer, db.ForeignKey("slide.id"), nullable=False)

    question_answers = db.relationship("QuestionAnswer", backref="question")
    alternatives = db.relationship("QuestionAlternative", backref="question")

    def __init__(self, name, total_score, type_id, slide_id):
        self.name = name
        self.total_score = total_score
        self.type_id = type_id
        self.slide_id = slide_id


class QuestionAlternative(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_SIZE), nullable=False)
    value = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    def __init__(self, text, value, question_id):
        self.text = text
        self.value = value
        self.question_id = question_id


class QuestionAnswer(db.Model):
    __table_args__ = (db.UniqueConstraint("question_id", "team_id"),)
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(Dictionary(), nullable=False)
    score = db.Column(db.Integer, nullable=False, default=0)

    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=False)

    def __init__(self, data, score, question_id, team_id):
        self.data = data
        self.score = score
        self.question_id = question_id
        self.team_id = team_id


class Component(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer, nullable=False, default=0)
    y = db.Column(db.Integer, nullable=False, default=0)
    w = db.Column(db.Integer, nullable=False, default=1)
    h = db.Column(db.Integer, nullable=False, default=1)
    data = db.Column(Dictionary())
    slide_id = db.Column(db.Integer, db.ForeignKey("slide.id"), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("component_type.id"), nullable=False)

    def __init__(self, slide_id, type_id, data, x=0, y=0, w=1, h=1):
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.data = data
        self.slide_id = slide_id
        self.type_id = type_id


class Code(db.Model):
    table_args = (db.UniqueConstraint("pointer", "type"),)
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Text, unique=True)
    pointer = db.Column(db.Integer, nullable=False)

    view_type_id = db.Column(db.Integer, db.ForeignKey("view_type.id"), nullable=False)

    def __init__(self, code, pointer, view_type_id):
        self.code = code
        self.pointer = pointer
        self.view_type_id = view_type_id


class ViewType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    codes = db.relationship("Code", backref="view_type")

    def __init__(self, name):
        self.name = name


class ComponentType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    components = db.relationship("Component", backref="component_type")

    def __init__(self, name):
        self.name = name


class MediaType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    media = db.relationship("Media", backref="type")

    def __init__(self, name):
        self.name = name


class QuestionType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    questions = db.relationship("Question", backref="type")

    def __init__(self, name):
        self.name = name
