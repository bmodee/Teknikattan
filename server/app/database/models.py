from app import bcrypt, db
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.hybrid import hybrid_method, hybrid_property

STRING_SIZE = 254


class Blacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, unique=True, nullable=False)

    def __init__(self, jti):
        self.jti = jti


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="role")

    def __init__(self, name):
        self.name = name


class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="city")
    competitions = db.relationship("Competition", backref="city")

    def __init__(self, name):
        self.name = name


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(254), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=True)

    _password = db.Column(db.LargeBinary(60), nullable=False)
    authenticated = db.Column(db.Boolean, default=False)

    twoAuthConfirmed = db.Column(db.Boolean, default=True)  # Change to false for Two factor authen
    twoAuthCode = db.Column(db.String(100), nullable=True)

    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=True)  # Change to false
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=True)  # Change to false

    media = db.relationship("Media", backref="upload_by")

    def __init__(self, email, plaintext_password, role_id=None, city_id=None, name=None):
        self._password = bcrypt.generate_password_hash(plaintext_password)
        self.email = email
        self.role_id = role_id
        self.city_id = city_id
        self.name = name
        self.authenticated = False

    def get_dict(self):
        return {"id": self.id, "email": self.email, "name": self.name}

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
    type = db.Column(db.Integer, nullable=False)
    upload_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    styles = db.relationship("Style", backref="bg_image")

    def __init__(self, filename, type, upload_by_id):
        self.filename = filename
        self.type = type
        self.upload_by_id = upload_by_id


class Style(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    css = db.Column(db.Text, nullable=True)
    bg_image_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)

    competition = db.relationship("Competition", backref="style")

    def __init__(self, name, css=None, bg_image_id=None):
        self.name = name
        self.css = css
        self.bg_image_id = bg_image_id


class Competition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    style_id = db.Column(db.Integer, db.ForeignKey("style.id"), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=False)

    slides = db.relationship("Slide", backref="competition")
    teams = db.relationship("Team", backref="competition")

    def __init__(self, name, style_id, city_id):
        self.name = name
        self.style_id = style_id
        self.city_id = city_id


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    answered_questions = db.relationship("AnsweredQuestion", backref="team")

    def __init__(self, name, competition_id):
        self.name = name
        self.competition_id = competition_id


class Slide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    order = db.Column(db.Integer, nullable=False)
    tweak_settings = db.Column(db.Text, nullable=True)
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    questions = db.relationship("Question", backref="slide")

    def __init__(self, name, order, competition_id, tweak_settings=None):
        self.name = name
        self.order = order
        self.competition_id = competition_id
        self.tweak_settings = tweak_settings


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    title = db.Column(db.String(STRING_SIZE), nullable=False)
    timer = db.Column(db.Integer, nullable=False)
    slide_id = db.Column(db.Integer, db.ForeignKey("slide.id"), nullable=False)

    answered_questions = db.relationship("AnsweredQuestion", backref="question")

    def __init__(self, name, title, timer, slide_id):
        self.name = name
        self.title = title
        self.timer = timer
        self.slide_id = slide_id


class TrueFalseQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    true_false = db.Column(db.Boolean, nullable=False, default=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    question = db.relationship("Question", foreign_keys=[question_id], uselist=False)

    def __init__(self, true_false, question_id):
        self.true_false = true_false
        self.question_id = question_id


class TextQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    question = db.relationship("Question", foreign_keys=[question_id], uselist=False)
    alternatives = db.relationship("TextQuestionAlternative", backref="text_question")

    def __init__(self, question_id):
        self.question_id = question_id


class TextQuestionAlternative(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_SIZE), nullable=False)
    text_question_id = db.Column(db.Integer, db.ForeignKey("text_question.id"), nullable=False)

    def __init__(self, text, text_question_id):
        self.text = text
        self.text_question_id = text_question_id


class MCQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(STRING_SIZE), nullable=False)
    timer = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    question = db.relationship("Question", foreign_keys=[question_id], uselist=False)
    alternatives = db.relationship("MCQuestionAlternative", backref="mc_question")

    def __init__(self, title, timer, slide_id):
        self.title = title
        self.timer = timer
        self.slide_id = slide_id


class MCQuestionAlternative(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_SIZE), nullable=False)
    true_false = db.Column(db.Boolean, nullable=False, default=False)
    mc_id = db.Column(db.Integer, db.ForeignKey("mc_question.id"), nullable=False)

    def __init__(self, text, true_false, mc_id):
        self.text = text
        self.true_false = true_false
        self.mc_id = mc_id


class AnsweredQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=False)

    def __init__(self, data, score, question_id, team_id):
        self.data = data
        self.score = score
        self.question_id = question_id
        self.team_id = team_id
