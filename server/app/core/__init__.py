import sqlalchemy as sa
from flask_bcrypt import Bcrypt
from flask_jwt_extended.jwt_manager import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy.model import Model
from sqlalchemy.sql import func


class Base(Model):
    __abstract__ = True
    _created = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    _updated = sa.Column(sa.DateTime(timezone=True), onupdate=func.now())


db = SQLAlchemy(model_class=Base)
bcrypt = Bcrypt()
jwt = JWTManager()
ma = Marshmallow()
