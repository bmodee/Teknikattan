import os
from datetime import timedelta


class Config:
    DEBUG = False
    TESTING = False
    BUNDLE_ERRORS = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "super-secret"
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=2)
    # JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    UPLOADED_PHOTOS_DEST = os.path.join(os.getcwd(), "app", "static", "images")
    THUMBNAIL_SIZE = (120, 120)
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_ECHO = False
    USER_LOGIN_LOCKED_ATTEMPTS = 12
    USER_LOGIN_LOCKED_EXPIRES = timedelta(hours=3)
    JSON_SORT_KEYS = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False
    # HOST = "localhost"
    # PORT = 5432
    # USER = "postgres"
    # PASSWORD = "password"
    # DATABASE = "teknik8"
    # SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    # SQLALCHEMY_DATABASE_URI = "postgresql://" + USER + ":" + PASSWORD + "@" + HOST + ":" + str(PORT) + "/" + DATABASE


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
    USER_LOGIN_LOCKED_ATTEMPTS = 4
    USER_LOGIN_LOCKED_EXPIRES = timedelta(seconds=4)


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    # HOST = "localhost"
    # PORT = 5432
    # USER = "postgres"
    # PASSWORD = "password"
    # DATABASE = "teknik8"
    # SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    # SQLALCHEMY_DATABASE_URI = "postgresql://" + USER + ":" + PASSWORD + "@" + HOST + ":" + str(PORT) + "/" + DATABASE
