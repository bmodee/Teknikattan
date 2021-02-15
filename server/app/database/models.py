from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from sqlalchemy.ext.declarative import declared_attr

from app import bcrypt, db
from app.database import Base


class Blacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, unique=True, nullable=False)

    @declared_attr
    def __tablename__(self):
        return "blacklist"

    def __init__(self, jti):
        self.jti = jti


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(254), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=True)

    _password = db.Column(db.LargeBinary(60), nullable=False)
    authenticated = db.Column(db.Boolean, default=False)

    twoAuthConfirmed = db.Column(db.Boolean, default=True)  # Change to false for Two factor authen
    twoAuthCode = db.Column(db.String(100), nullable=True)

    def __init__(self, email, plaintext_password, name=""):
        self._password = bcrypt.generate_password_hash(plaintext_password)
        self.email = email
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
