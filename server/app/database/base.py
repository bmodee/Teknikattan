import app.core.http_codes as codes
import sqlalchemy as sa
from flask_restx import abort
from flask_sqlalchemy import BaseQuery, SQLAlchemy
from flask_sqlalchemy.model import Model
from sqlalchemy.sql import func


class Base(Model):
    __abstract__ = True
    _created = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    _updated = sa.Column(sa.DateTime(timezone=True), onupdate=func.now())


class ExtendedQuery(BaseQuery):
    def first_extended(self, required=True, error_message=None, error_code=codes.NOT_FOUND):
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
