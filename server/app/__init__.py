import json

from flask import Flask, redirect, request
from flask_uploads import configure_uploads
from flask_uploads.extensions import IMAGES
from flask_uploads.flask_uploads import UploadSet

import app.database.models as models
from app.apis import init_api
from app.core import bcrypt, db, jwt, ma


def load_secret_config(mode, database):
    with open("./secret-webconfig.json") as f:
        config = json.load(f)

    mode_config = config[mode]
    result = {"JWT_SECRET_KEY": mode_config["JWT_SECRET_KEY"]}

    if database == "postgre":
        pg = mode_config["postgre"]
        uri = f"postgresql://{pg['USER']}:{pg['PASSWORD']}@{pg['HOST']}:{str(pg['PORT'])}/{pg['DATABASE']}"
        result["SQLALCHEMY_DATABASE_URI"] = uri
    elif database == "lite":
        lite = mode_config["lite"]
        result["SQLALCHEMY_DATABASE_URI"] = lite["SQLALCHEMY_DATABASE_URI"]

    return result


def create_app(mode, database):
    """
    Creates Flask app, returns it and a SocketIO instance. Call run on the
    SocketIO instance and pass in the Flask app to start the server.
    """
    if mode == "dev":
        config_name = "configmodule.DevelopmentConfig"
    elif mode == "prod":
        config_name = "configmodule.ProductionConfig"
    elif mode == "test":
        config_name = "configmodule.TestingConfig"
    else:
        raise Exception("Invalid mode\nValid modes are: dev, prod and test")

    # Init flask
    app = Flask(__name__, static_url_path="/static", static_folder="static")

    # Init config
    app.config.from_object(config_name)

    # Init secret config
    secret_config = load_secret_config(mode, database)
    app.config.update(secret_config)

    print(app.config.get("SERVER_NAME"))
    app.url_map.strict_slashes = False

    with app.app_context():

        # Init flask apps
        bcrypt.init_app(app)
        jwt.init_app(app)
        db.init_app(app)
        db.create_all()
        ma.init_app(app)
        configure_uploads(app, (UploadSet("photos", IMAGES),))

        # Init socket
        from app.core.sockets import sio

        sio.init_app(app)

        # Init api
        from app.apis import flask_api

        flask_api.init_app(app)
        init_api()

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
