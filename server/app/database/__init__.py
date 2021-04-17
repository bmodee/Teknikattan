import json

from flask_restx import abort
from flask_sqlalchemy import BaseQuery
from flask_sqlalchemy.model import Model
from sqlalchemy import Column, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.types import TypeDecorator


class Base(Model):
    __abstract__ = True
    _created = Column(DateTime(timezone=True), server_default=func.now())
    _updated = Column(DateTime(timezone=True), onupdate=func.now())


class ExtendedQuery(BaseQuery):
    def first_extended(self, required=True, error_message=None, error_code=404):
        item = self.first()

        if required and not item:
            if not error_message:
                error_message = "Object not found"
            abort(error_code, error_message)

        return item

    def pagination(self, page=0, page_size=15, order_column=None, order=1):
        query = self
        if order_column:
            if order == 1:
                query = query.order_by(order_column)
            else:
                query = query.order_by(order_column.desc())

        total = query.count()
        query = query.limit(page_size).offset(page * page_size)
        items = query.all()
        return items, total


class Dictionary(TypeDecorator):

    impl = Text(1024)

    def process_bind_param(self, value, dialect):
        if value is not None:
            value = json.dumps(value).replace("'", '"')

        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = json.loads(value)
        return value
