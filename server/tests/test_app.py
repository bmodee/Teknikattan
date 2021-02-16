from tests import app, client
import json


def test_app(client):

    # Create user
    rv = client.post(
        "/api/users/",
        data=json.dumps({"email": "test@test.se", "password": "abc123"}),
    )
    rv_dict = json.loads(rv.data.decode())

    assert rv.status_code == 200
    assert rv_dict["id"] == 1
    assert "password" not in rv_dict
    assert rv_dict["email"] == "test@test.se"

    # Try loggin with wrong PASSWORD
    rv = client.post("/api/users/login", data=json.dumps({"email": "test@test.se", "password": "abc1234"}))
    assert rv.status_code == 401

    # Try loggin with wrong Email
    rv = client.post("/api/users/login", data=json.dumps({"email": "test1@test.se", "password": "abc1234"}))
    assert rv.status_code == 401

    # Try loggin with right PASSWORD
    rv = client.post("/api/users/login", data=json.dumps({"email": "test@test.se", "password": "abc123"}))
    rv_dict = json.loads(rv.data.decode())
    assert rv.status_code == 200
    headers = {"Authorization": "Bearer " + rv_dict["access_token"]}

    # Get the current user
    rv = client.get("/api/users/", headers=headers)
    rv_dict = json.loads(rv.data.decode())
    assert rv.status_code == 200
    assert rv_dict["email"] == "test@test.se"

    rv = client.put("/api/users/", data=json.dumps({"name": "carl carlsson"}), headers=headers)
    rv_dict = json.loads(rv.data.decode())
    assert rv.status_code == 200
    assert rv_dict["name"] == "Carl Carlsson"
