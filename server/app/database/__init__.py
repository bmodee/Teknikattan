from flask_sqlalchemy.model import Model
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func


class Base(Model):
    @declared_attr
    def __tablename__(self):
        return self.__class__.__name__.replace("Model", "s").lower()

    created = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    updated = sa.Column(sa.DateTime(timezone=True), onupdate=func.now())
