from flask_restx import inputs, reqparse

###SEARCH####
search_parser = reqparse.RequestParser()
search_parser.add_argument("page", type=int, default=0, location="args")
search_parser.add_argument("page_size", type=int, default=15, location="args")

###LOGIN####
login_parser = reqparse.RequestParser()
login_parser.add_argument("email", type=inputs.email(), required=True, location="json")
login_parser.add_argument("password", required=True, location="json")

###CREATE_USER####
create_user_parser = login_parser.copy()
create_user_parser.add_argument("email", type=inputs.email(), required=True, location="json")
create_user_parser.add_argument("city_id", type=int, required=True, location="json")
create_user_parser.add_argument("role_id", type=int, required=True, location="json")

###USER####
user_parser = reqparse.RequestParser()
user_parser.add_argument("email", type=inputs.email(), location="json")
user_parser.add_argument("name", type=str, location="json")
user_parser.add_argument("city_id", type=int, location="json")
user_parser.add_argument("role_id", type=int, location="json")

###SEARCH_USER####
user_search_parser = search_parser.copy()
user_search_parser.add_argument("name", type=str, default=None, location="args")
user_search_parser.add_argument("email", type=str, default=None, location="args")
user_search_parser.add_argument("city_id", type=int, default=None, location="args")
user_search_parser.add_argument("role_id", type=int, default=None, location="args")


###COMPETIION####
competition_parser = reqparse.RequestParser()
competition_parser.add_argument("name", type=str, location="json")
competition_parser.add_argument("year", type=int, location="json")
competition_parser.add_argument("city_id", type=int, location="json")
competition_parser.add_argument("style_id", type=int, location="json")


###SEARCH_COMPETITOIN####
competition_search_parser = search_parser.copy()
competition_search_parser.add_argument("name", type=str, default=None, location="args")
competition_search_parser.add_argument("year", type=str, default=None, location="args")
competition_search_parser.add_argument("city_id", type=int, default=None, location="args")
competition_search_parser.add_argument("style_id", type=int, default=None, location="args")
