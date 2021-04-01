import json

from app.core.utils.test_helpers import add_default_values, delete, get, post, put

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

    response, body = post(client, "/api/competitions/1/slides", {}, headers=headers)
    assert response.status_code == 200

    response, body = get(client, "/api/competitions/1/slides", headers=headers)
    assert response.status_code == 200
    assert len(body) == 2

    response, body = put(client, "/api/competitions/1/slides/1/order", {"order": 1}, headers=headers)
    assert response.status_code == 200

    response, body = post(client, "/api/competitions/1/teams", {"name": "t1"}, headers=headers)
    assert response.status_code == 200

    response, body = get(client, "/api/competitions/1/teams", headers=headers)
    assert response.status_code == 200
    assert len(body) == 1
    assert body[0]["name"] == "t1"

    response, body = delete(client, "/api/competitions/1", {}, headers=headers)
    assert response.status_code == 200


def test_app(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == 200
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Create user
    register_data = {"email": "test1@test.se", "password": "abc123", "role_id": 2, "city_id": 1}
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

    # Edit current user name
    response, body = put(client, "/api/users", {"name": "carl carlsson"}, headers=headers)
    assert response.status_code == 200
    assert body["name"] == "Carl Carlsson"

    # Delete created user
    response, body = delete(client, "/api/auth/delete/1", {}, headers=headers)
    assert response.status_code == 200
