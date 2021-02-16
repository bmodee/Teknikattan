import pytest
from app import create_app, db


@pytest.fixture
def app():
    app = create_app("configmodule.TestingConfig")

    with app.app_context():
        db.drop_all()
        db.create_all()

    return app


@pytest.fixture
def client(app):
    return app.test_client()
