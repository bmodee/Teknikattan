"""
The core submodule contains everything important to the server that doesn't
fit neatly in either apis or database.
"""

from app.database import Base, ExtendedQuery
from flask_bcrypt import Bcrypt
from flask_jwt_extended.jwt_manager import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(model_class=Base, query_class=ExtendedQuery)
bcrypt = Bcrypt()
jwt = JWTManager()
ma = Marshmallow()
