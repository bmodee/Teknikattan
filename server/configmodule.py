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
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    UPLOADED_PHOTOS_DEST = "static/images"  # os.getcwd()
    SECRET_KEY = os.urandom(24)


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_ECHO = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    # HOST = 'postgresql'
    # PORT = 5432
    # USER = 'asd'
    # PASSWORD = 'asd'
    # DATABASE = 'asd'
    # DATABASE_URI = 'postgresql://'+USER+":"+PASSWORD+"@"+HOST+":"+str(PORT)+"/"+DATABASE
