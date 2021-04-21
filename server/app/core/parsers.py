from flask_restx import inputs, reqparse

###SEARCH####
search_parser = reqparse.RequestParser()
search_parser.add_argument("page", type=int, default=0, location="args")
search_parser.add_argument("page_size", type=int, default=15, location="args")
search_parser.add_argument("order", type=int, default=1, location="args")
search_parser.add_argument("order_by", type=str, default=None, location="args")

###LOGIN####
login_parser = reqparse.RequestParser()
login_parser.add_argument("email", type=inputs.email(), required=True, location="json")
login_parser.add_argument("password", required=True, location="json")

###CREATE_USER####
create_user_parser = login_parser.copy()
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


###COMPETITION####
competition_parser = reqparse.RequestParser()
competition_parser.add_argument("name", type=str, location="json")
competition_parser.add_argument("year", type=int, location="json")
competition_parser.add_argument("city_id", type=int, location="json")


###SEARCH_COMPETITION####
competition_search_parser = search_parser.copy()
competition_search_parser.add_argument("name", type=str, default=None, location="args")
competition_search_parser.add_argument("year", type=int, default=None, location="args")
competition_search_parser.add_argument("city_id", type=int, default=None, location="args")


###SLIDER_PARSER####
slide_parser = reqparse.RequestParser()
slide_parser.add_argument("order", type=int, default=None, location="json")
slide_parser.add_argument("title", type=str, default=None, location="json")
slide_parser.add_argument("timer", type=int, default=None, location="json")


###QUESTION####
question_parser = reqparse.RequestParser()
question_parser.add_argument("name", type=str, default=None, location="json")
question_parser.add_argument("total_score", type=int, default=None, location="json")
question_parser.add_argument("type_id", type=int, default=None, location="json")
question_parser.add_argument("slide_id", type=int, location="json")


###QUESTION ALTERNATIVES####
question_alternative_parser = reqparse.RequestParser()
question_alternative_parser.add_argument("text", type=str, default=None, location="json")
question_alternative_parser.add_argument("value", type=int, default=None, location="json")

###QUESTION ANSWERS####
question_answer_parser = reqparse.RequestParser()
question_answer_parser.add_argument("data", type=dict, required=True, location="json")
question_answer_parser.add_argument("score", type=int, required=True, location="json")
question_answer_parser.add_argument("question_id", type=int, required=True, location="json")

###QUESTION ANSWERS EDIT####
question_answer_edit_parser = reqparse.RequestParser()
question_answer_edit_parser.add_argument("data", type=dict, default=None, location="json")
question_answer_edit_parser.add_argument("score", type=int, default=None, location="json")

###CODE####
code_parser = reqparse.RequestParser()
code_parser.add_argument("pointer", type=str, default=None, location="json")
code_parser.add_argument("view_type_id", type=int, default=None, location="json")


###TEAM####
team_parser = reqparse.RequestParser()
team_parser.add_argument("name", type=str, location="json")

###SEARCH_COMPETITION####
media_parser_search = search_parser.copy()
media_parser_search.add_argument("filename", type=str, default=None, location="args")


###COMPONENT###
component_parser = reqparse.RequestParser()
component_parser.add_argument("x", type=str, default=None, location="json")
component_parser.add_argument("y", type=int, default=None, location="json")
component_parser.add_argument("w", type=int, default=None, location="json")
component_parser.add_argument("h", type=int, default=None, location="json")
component_parser.add_argument("data", type=dict, default=None, location="json")

component_create_parser = component_parser.copy()
component_create_parser.replace_argument("data", type=dict, required=True, location="json")
component_create_parser.add_argument("type_id", type=int, required=True, location="json")

login_code_parser = reqparse.RequestParser()
login_code_parser.add_argument("code", type=str, location="json")
