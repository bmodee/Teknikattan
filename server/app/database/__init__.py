"""
The database submodule contaisn all functionality that has to do with the
database. It can add, get, delete, edit, search and copy items.
"""

from flask_restx import abort
from flask_sqlalchemy import BaseQuery
from flask_sqlalchemy.model import Model
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func


class Base(Model):
    """
    Abstract table/model that all tables inherit
    """

    __abstract__ = True
    _created = Column(DateTime(timezone=True), server_default=func.now())
    _updated = Column(DateTime(timezone=True), onupdate=func.now())


class ExtendedQuery(BaseQuery):
    """
    Extensions to a regular query which makes using the database more convenient.
    """

    def first_api(self, required=True, error_message=None, error_code=404):
        """
        Extensions of the first() functions otherwise used on queries. Abort
        if no item was found and it was required.

        :param required: Raise an exception if the query results in None
        :type required: bool
        :param error_message: The message that will be sent to the client with the exception
        :type error_message:str
        :param error_code: The status code that will be sent to the client with the exception
        :type error_code: int
        :return:
        :rtype:
        """

        item = self.first()

        if required and not item:
            error_message = error_message or "Object not found"
            abort(error_code, error_message)

        return item

    def pagination(self, page=0, page_size=15, order_column=None, order=1):
        """
        When looking for lists of items this is used to only return a few of
        them to allow for pagination.
        :param page: Offset of the result
        :type page: int
        :param page_size: Amount of rows that will be retrieved from the query
        :type page_size: int
        :param order_column: Field of a DbModel in which the query shall order by
        :type order_column: sqlalchemy.sql.schema.Column
        :param order: If equals 1 then order by ascending otherwise order by descending
        :type order: int
        :return: A page/list of items with offset page*page_size and the total count of all rows ignoring page and page_size
        :rtype: list, int
        """

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


# class Dictionary(TypeDecorator):

#     impl = Text

#     def process_bind_param(self, value, dialect):
#         if value is not None:
#             value = json.dumps(value)

#         return value

#     def process_result_value(self, value, dialect):
#         if value is not None:
#             value = json.loads(value)
#         return value
