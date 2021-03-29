import json

from app.database.populate import add_default_values
from app.utils.test_helpers import delete, get, post, put

from tests import app, client


def test_app(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/users/login", {"email": "test@test.se", "password": "password"})
    item = body["result"][0]
    headers = {"Authorization": "Bearer " + item["access_token"]}

    # Create user
    register_data = {"email": "test1@test.se", "password": "abc123", "role": "Admin", "city": "Linköping"}
    response, body = post(client, "/api/users/", register_data, headers)
    item = body["result"][0]

    assert response.status_code == 200
    assert item["id"] == 2
    assert "password" not in item
    assert item["email"] == "test1@test.se"

    # Try loggin with wrong PASSWORD
    response, body = post(client, "/api/users/login", {"email": "test1@test.se", "password": "abc1234"})
    assert response.status_code == 401

    # Try loggin with wrong Email
    response, body = post(client, "/api/users/login", {"email": "testx@test.se", "password": "abc1234"})
    assert response.status_code == 401

    # Try loggin with right PASSWORD
    response, body = post(client, "/api/users/login", {"email": "test1@test.se", "password": "abc123"})
    item = body["result"][0]
    headers = {"Authorization": "Bearer " + item["access_token"]}
    assert response.status_code == 200

    # Get the current user
    response, body = get(client, "/api/users/", headers=headers)
    item = body["result"][0]
    assert response.status_code == 200
    assert item["email"] == "test1@test.se"

    response, body = put(client, "/api/users/", {"name": "carl carlsson"}, headers=headers)
    item = body["result"][0]
    assert response.status_code == 200
    assert item["name"] == "Carl Carlsson"
