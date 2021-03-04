from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended.jwt_manager import JWTManager
from flask_sqlalchemy import SQLAlchemy

from app.database import Base

bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy(model_class=Base)

from app.database import models


def create_app(config_name="configmodule.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_name)

    with app.app_context():

        bcrypt.init_app(app)
        jwt.init_app(app)
        db.init_app(app)

        from app.api import api_blueprint

        app.register_blueprint(api_blueprint, url_prefix="/api")

        return app


def identity(payload):
    user_id = payload["identity"]
    return models.User.query.filter_by(id=user_id)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token["jti"]

    return models.Blacklist.query.filter_by(jti=jti).first() != None
