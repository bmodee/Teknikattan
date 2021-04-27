from flask_restx import inputs, reqparse

###SEARCH####
search_parser = reqparse.RequestParser()
search_parser.add_argument("page", type=int, default=0, location="args")
search_parser.add_argument("page_size", type=int, default=15, location="args")
search_parser.add_argument("order", type=int, default=1, location="args")
search_parser.add_argument("order_by", type=str, default=None, location="args")
