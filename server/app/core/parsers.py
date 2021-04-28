from flask_restx import inputs, reqparse


class Sentinel:
    """
    Sentinel is used as default argument to parsers if it isn't necessary to
    supply a value. This is used instead of None so that None can be supplied
    as value.
    """

    def __repr__(self):
        return "Sentinel"

    def __bool__(self):
        return False


sentinel = Sentinel()

###SEARCH####
search_parser = reqparse.RequestParser()
search_parser.add_argument("page", type=int, default=0, location="args")
search_parser.add_argument("page_size", type=int, default=15, location="args")
search_parser.add_argument("order", type=int, default=1, location="args")
search_parser.add_argument("order_by", type=str, default=None, location="args")
