from app import bcrypt, db
from sqlalchemy.ext.hybrid import hybrid_method, hybrid_property

STRING_SIZE = 254


class Blacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, unique=True)
    expire_date = db.Column(db.Integer, nullable=True)

    def __init__(self, jti):
        self.jti = jti

    def get_dict(self):
        return {"id": self.id, "jti": self.jti, "expire_date": self.expire_date}


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)

    users = db.relationship("User", backref="role")

    def __init__(self, name):
        self.name = name

    def get_dict(self):
        return {"id": self.id, "name": self.name}


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

    def __init__(self, email, plaintext_password, role_id, city_id):
        self._password = bcrypt.generate_password_hash(plaintext_password)
        self.email = email
        self.role_id = role_id
        self.city_id = city_id
        self.authenticated = False

    def get_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role_id": self.role_id,
            "city_id": self.city_id,
        }

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

    styles = db.relationship("Style", backref="bg_image")

    def __init__(self, filename, type_id, upload_by_id):
        self.filename = filename
        self.type_id = type_id
        self.upload_by_id = upload_by_id


class Style(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    css = db.Column(db.Text, nullable=False)
    bg_image_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=True)

    competition = db.relationship("Competition", backref="style")

    def __init__(self, name, css, bg_image_id=None):
        self.name = name
        self.css = css
        self.bg_image_id = bg_image_id


class Competition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), unique=True)
    year = db.Column(db.Integer, nullable=False, default=2020)

    style_id = db.Column(db.Integer, db.ForeignKey("style.id"), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("city.id"), nullable=False)

    slides = db.relationship("Slide", backref="competition")
    teams = db.relationship("Team", backref="competition")

    def __init__(self, name, year, style_id, city_id):
        self.name = name
        self.year = year
        self.style_id = style_id
        self.city_id = city_id


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
    tweak_settings = db.Column(db.Text, nullable=False, default="")
    competition_id = db.Column(db.Integer, db.ForeignKey("competition.id"), nullable=False)

    questions = db.relationship("Question", backref="slide")

    def __init__(self, order, competition_id):
        self.order = order
        self.competition_id = competition_id


class Question(db.Model):
    __table_args__ = (db.UniqueConstraint("slide_id", "name"), db.UniqueConstraint("slide_id", "order"))
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_SIZE), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("question_type.id"), nullable=False)
    slide_id = db.Column(db.Integer, db.ForeignKey("slide.id"), nullable=False)
    question_answers = db.relationship("QuestionAnswer", backref="question")
    alternatives = db.relationship("QuestionAlternative", backref="question")

    def __init__(self, name, order, type_id, slide_id):
        self.name = name
        self.order = order
        self.type_id = type_id
        self.slide_id = slide_id


class QuestionAlternative(db.Model):
    __table_args__ = (db.UniqueConstraint("question_id", "order"),)
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_SIZE), nullable=False)
    value = db.Column(db.Boolean, nullable=False)
    order = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    def __init__(self, text, value, order, question_id):
        self.text = text
        self.value = value
        self.order = order
        self.question_id = question_id


# TODO QuestionAnswer
class QuestionAnswer(db.Model):
    __table_args__ = (db.UniqueConstraint("question_id", "team_id"),)
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text, nullable=False)
    score = db.Column(db.Integer, nullable=False, default=0)  # 0: False, 1: True
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=False)

    def __init__(self, data, score, question_id, team_id):
        self.data = data
        self.score = score
        self.question_id = question_id
        self.team_id = team_id


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


"""
QuestionHandler = db.Table(
    "question_handler",
    db.Column("question_id", db.Integer, db.ForeignKey("question.id"), primary_key=True),
    db.Column("sub_question_id", db.Integer, unique=True),
    db.Column("question_type", db.Integer, nullable=False),
)

class TrueFalseQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    true_false = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, true_false):
        self.true_false = true_false


class TextQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    alternatives = db.relationship("TextQuestionAlternative", backref="text_question")


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
    alternatives = db.relationship("MCQuestionAlternative", backref="mc_question")

    def __init__(self, title, timer):
        self.title = title
        self.timer = timer


class MCQuestionAlternative(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_SIZE), nullable=False)
    true_false = db.Column(db.Boolean, nullable=False, default=False)
    mc_id = db.Column(db.Integer, db.ForeignKey("mc_question.id"), nullable=False)

    def __init__(self, text, true_false, mc_id):
        self.text = text
        self.true_false = true_false
        self.mc_id = mc_id



"""
