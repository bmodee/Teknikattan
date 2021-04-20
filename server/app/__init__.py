from flask import Flask, redirect, request
from flask_uploads import configure_uploads

import app.database.models as models
from app.core import bcrypt, db, jwt, ma
from app.core.dto import MediaDTO


def create_app(config_name="configmodule.DevelopmentConfig"):
    app = Flask(__name__, static_url_path="/static", static_folder="static")
    app.config.from_object(config_name)
    app.url_map.strict_slashes = False
    with app.app_context():

        bcrypt.init_app(app)
        jwt.init_app(app)
        db.init_app(app)
        db.create_all()
        ma.init_app(app)
        configure_uploads(app, (MediaDTO.image_set,))

        from app.core.sockets import sio

        sio.init_app(app)

        from app.apis import flask_api

        flask_api.init_app(app)

        @app.before_request
        def clear_trailing():
            rp = request.path
            if rp != "/" and rp.endswith("/"):
                return redirect(rp[:-1])

        @app.after_request
        def set_core(response):
            header = response.headers
            header["Access-Control-Allow-Origin"] = "*"
            return response

    return app, sio


def identity(payload):
    user_id = payload["identity"]
    return models.User.query.filter_by(id=user_id)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token["jti"]

    return models.Blacklist.query.filter_by(jti=jti).first() is not None
