"""
The core submodule contains everything important to the server that doesn't
fit neatly in either apis or database.
"""
import app.database.models as models
from app.database import Base, ExtendedQuery
from flask_bcrypt import Bcrypt
from flask_jwt_extended.jwt_manager import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

# Flask apps
db = SQLAlchemy(model_class=Base, query_class=ExtendedQuery)
bcrypt = Bcrypt()
jwt = JWTManager()
ma = Marshmallow()


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_headers, jwt_data):
    """
    An extension method with flask_jwt_extended that will execute when jwt verifies
    Check if the token is blacklisted in the database
    """

    jti = jwt_data["jti"]
    return models.Blacklist.query.filter_by(jti=jti).first() is not None
