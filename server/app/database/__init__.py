import sqlalchemy as sa
from flask_sqlalchemy.model import Model
from sqlalchemy.sql import func


class Base(Model):
    __abstract__ = True
    _created = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    _updated = sa.Column(sa.DateTime(timezone=True), onupdate=func.now())
