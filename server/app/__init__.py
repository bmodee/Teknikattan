from flask import Flask, redirect, request
from flask_uploads import configure_uploads

import app.database.models as models
from app.core import bcrypt, db, jwt, ma
from app.core.dto import MediaDTO


def create_app(config_name="configmodule.DevelopmentConfig"):
    """
    Creates Flask app, returns it and a SocketIO instance. Call run on the
    SocketIO instance and pass in the Flask app to start the server.
    """

    # Init flask
    app = Flask(__name__, static_url_path="/static", static_folder="static")
    app.config.from_object(config_name)
    app.url_map.strict_slashes = False

    with app.app_context():

        # Init flask apps
        bcrypt.init_app(app)
        jwt.init_app(app)
        db.init_app(app)
        db.create_all()
        ma.init_app(app)
        configure_uploads(app, (MediaDTO.image_set,))

        # Init socket
        from app.core.sockets import sio

        sio.init_app(app)

        # Init api
        from app.apis import flask_api

        flask_api.init_app(app)

        # Flask helpers methods

        @app.before_request
        def clear_trailing():
            rp = request.path
            if rp != "/" and rp.endswith("/"):
                return redirect(rp[:-1])

        @app.after_request
        def set_corse(response):
            header = response.headers
            header["Access-Control-Allow-Origin"] = "*"
            return response

    return app, sio
