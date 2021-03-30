import json

from app.core.utils.test_helpers import add_default_values, get, post, put

from tests import app, client, db


def test_competition(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == 200
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Create competition
    data = {"name": "c1", "year": 2020, "city_id": 1, "style_id": 1}
    response, body = post(client, "/api/competitions", data, headers=headers)
    assert response.status_code == 200
    assert body["name"] == "c1"

    # Get competition
    response, body = get(client, "/api/competitions/1", headers=headers)
    assert response.status_code == 200
    assert body["name"] == "c1"


def test_app(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == 200
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Create user
    register_data = {"email": "test1@test.se", "password": "abc123", "role": "Admin", "city": "Linköping"}
    response, body = post(client, "/api/auth/signup", register_data, headers)

    assert response.status_code == 200
    assert body["id"] == 2
    assert "password" not in body

    # Try loggin with wrong PASSWORD
    response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc1234"})
    assert response.status_code == 401

    # Try loggin with wrong Email
    response, body = post(client, "/api/auth/login", {"email": "testx@test.se", "password": "abc1234"})
    assert response.status_code == 401

    # Try loggin with right PASSWORD
    response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc123"})
    assert response.status_code == 200
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get the current user
    response, body = get(client, "/api/users", headers=headers)
    assert response.status_code == 200
    assert body["email"] == "test1@test.se"

    response, body = put(client, "/api/users", {"name": "carl carlsson"}, headers=headers)
    assert response.status_code == 200
    assert body["name"] == "Carl Carlsson"
