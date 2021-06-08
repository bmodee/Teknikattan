"""
The database submodule contaisn all functionality that has to do with the
database. It can add, get, delete, edit, search and copy items.
"""

from app.apis import http_codes
from flask_smorest import abort
from flask_smorest.pagination import PaginationParameters
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

    def first_api(self, required=True, error_message=None, error_code=http_codes.NOT_FOUND):
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
            abort(error_code, message=error_message or "Objektet hittades inte")

        return item

    def paginate_api(self, pagination_parameters, order_columns=None):
        """
        When looking for lists of items this is used to only return a few of
        them to allow for pagination.
        :param page: Offset of the result
        :type page: int
        :param page_size: Amount of rows that will be retrieved from the query
        :type page_size: int
        :param order_columns: Field of a DbModel in which the query shall order by
        :type tuple: Tuple containting sqlalchemy.sql.schema.Column
        :param order: If equals 1 then order by ascending otherwise order by descending
        :type order: int
        :return: A page/list of items with offset page*page_size and the total count of all rows ignoring page and page_size
        :rtype: list, int
        """

        pagination_parameters = pagination_parameters or PaginationParameters(page=1, page_size=10)

        if order_columns:
            self = self.order_by(*order_columns)

        pagination = self.paginate(page=pagination_parameters.page, per_page=pagination_parameters.page_size)
        pagination_parameters.item_count = pagination.total
        return pagination.items
