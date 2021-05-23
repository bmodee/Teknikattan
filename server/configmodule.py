import os
from datetime import timedelta


class DevDbConfig:
    HOST = "localhost"
    PORT = 5432
    USER = "postgres"
    PASSWORD = "password"
    DATABASE = "teknik8"
    SQLALCHEMY_DATABASE_URI = "postgresql://" + USER + ":" + PASSWORD + "@" + HOST + ":" + str(PORT) + "/" + DATABASE


class TestDbConfig:
    HOST = "localhost"
    PORT = 5432
    USER = "postgres"
    PASSWORD = "password"
    DATABASE = "teknik8-test"
    SQLALCHEMY_DATABASE_URI = "postgresql://" + USER + ":" + PASSWORD + "@" + HOST + ":" + str(PORT) + "/" + DATABASE


class LiteDevDbConfig:
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"


class LiteTestDbConfig:
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"


class Config:
    DEBUG = False
    TESTING = False
    BUNDLE_ERRORS = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    JWT_SECRET_KEY = "super-secret"
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=2)
    # JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JSON_SORT_KEYS = False
    UPLOADED_PHOTOS_DEST = os.path.join(os.getcwd(), "app", "static", "images")
    THUMBNAIL_SIZE = (120, 120)
    SECRET_KEY = os.urandom(24)
    USER_LOGIN_LOCKED_ATTEMPTS = 12
    USER_LOGIN_LOCKED_EXPIRES = timedelta(hours=3)

    # Configure flask_smorest
    API_TITLE = "Teknikåttan"
    API_VERSION = "v1.0"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"


class DevelopmentConfig(Config, LiteDevDbConfig):
    DEBUG = True


class TestingConfig(Config, LiteTestDbConfig):
    TESTING = True
    USER_LOGIN_LOCKED_ATTEMPTS = 4
    USER_LOGIN_LOCKED_EXPIRES = timedelta(seconds=4)


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    # HOST = "localhost"
    # PORT = 5432
    # USER = "postgres"
    # PASSWORD = "password"
    # DATABASE = "teknik8"
    # SQLALCHEMY_DATABASE_URI = "postgresql://" + USER + ":" + PASSWORD + "@" + HOST + ":" + str(PORT) + "/" + DATABASE
