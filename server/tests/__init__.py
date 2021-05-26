import pytest
from app import create_app, db

DISABLE_TESTS = False


@pytest.fixture
def app():
    app, _ = create_app("configmodule.TestingConfig")
    app.app_context().push()
    db.drop_all()
    db.create_all()
    return app


@pytest.fixture
def client(app):
    return app.test_client()
