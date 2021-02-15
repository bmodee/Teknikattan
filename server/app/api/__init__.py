from flask import Blueprint

api_blueprint = Blueprint("api", __name__)

# Import the rest of the routes.
from app.api import users, admin
