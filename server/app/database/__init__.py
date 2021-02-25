import sqlalchemy as sa
from flask_sqlalchemy.model import Model
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func


class Base(Model):
    __abstract__ = True
    created = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    updated = sa.Column(sa.DateTime(timezone=True), onupdate=func.now())
