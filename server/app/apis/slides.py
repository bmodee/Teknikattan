import app.core.controller as dbc
import app.core.utils.http_codes as codes
from app.apis import admin_required
from app.core.models import Competition, Slide, User
from app.core.parsers import competition_parser, competition_search_parser
from app.core.schemas import competition_schema
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource
