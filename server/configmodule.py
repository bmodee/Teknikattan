class Config:
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    JWT_SECRET_KEY = "super-secret"
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    # HOST = 'postgresql'
    # PORT = 5432
    # USER = 'asd'
    # PASSWORD = 'asd'
    # DATABASE = 'asd'
    # DATABASE_URI = 'postgresql://'+USER+":"+PASSWORD+"@"+HOST+":"+str(PORT)+"/"+DATABASE
