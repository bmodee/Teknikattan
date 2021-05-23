"""
This file tests the api function calls.
"""

import time

import pytest
from app.apis import http_codes
from app.core import sockets

from tests import DISABLE_TESTS, app, client, db
from tests.test_helpers import add_default_values, change_order_test, delete, get, post, put


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_locked_api(client):
    add_default_values()

    # Login in with default user but wrong password until blocked
    for i in range(4):
        response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password1"})
        assert response.status_code == http_codes.UNAUTHORIZED

    # Login with right password, user should be locked
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.UNAUTHORIZED

    # Sleep for 4 secounds
    time.sleep(4)

    # Check so the user is no longer locked
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_misc_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get types
    response, body = get(client, "/api/misc/types", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body["media_types"]) >= 2
    assert len(body["question_types"]) >= 3
    assert len(body["component_types"]) >= 2
    assert len(body["view_types"]) >= 2

    ## Get misc
    response, body = get(client, "/api/misc/roles", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 2  # There are currently two roles

    response, body = get(client, "/api/misc/cities", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) >= 2
    assert body[0]["name"] == "Linköping" and body[1]["name"] == "Testköping"

    ## Cities
    response, body = post(client, "/api/misc/cities", {"name": "Göteborg"}, headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) >= 2 and body[2]["name"] == "Göteborg"

    # Rename city
    response, body = put(client, "/api/misc/cities/3", {"name": "Gbg"}, headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) >= 2 and body[2]["name"] == "Gbg"

    # Delete city
    # First checks current cities
    response, body = get(client, "/api/misc/cities", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) >= 3
    assert body[0]["name"] == "Linköping"
    assert body[1]["name"] == "Testköping"
    assert body[2]["name"] == "Gbg"

    # Deletes city
    response, body = delete(client, "/api/misc/cities/3", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) >= 2
    assert body[0]["name"] == "Linköping" and body[1]["name"] == "Testköping"


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_competition_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Create competition
    data = {"name": "c1", "year": 2020, "city_id": 1}
    response, body = post(client, "/api/competitions", data, headers=headers)
    assert response.status_code == http_codes.OK
    assert body["name"] == "c1"
    competition_id = body["id"]

    # Get competition
    response, body = get(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.OK
    assert body["name"] == "c1"

    response, body = post(client, f"/api/competitions/{competition_id}/slides", headers=headers)
    assert response.status_code == http_codes.OK

    response, body = get(client, f"/api/competitions/{competition_id}/slides", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 2

    """
    response, body = put(client, f"/api/competitions/{competition_id}/slides/{2}/order", {"order": 1}, headers=headers)
    assert response.status_code == http_codes.OK
    """

    response, body = post(client, f"/api/competitions/{competition_id}/teams", {"name": "t1"}, headers=headers)
    assert response.status_code == http_codes.OK

    response, body = get(client, f"/api/competitions/{competition_id}/teams", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 1
    assert body[0]["name"] == "t1"

    response, body = delete(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.NO_CONTENT

    # Get competition
    competition_id = 2
    response, body = get(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.OK

    # Copies competition
    for _ in range(3):
        response, _ = post(client, f"/api/competitions/{competition_id}/copy", headers=headers)
        assert response.status_code == http_codes.OK


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_auth_and_user_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Login in with default user but wrong password
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password1"})
    assert response.status_code == http_codes.UNAUTHORIZED

    # Create user
    register_data = {"email": "test1@test.se", "password": "abc123", "role_id": 2, "city_id": 1}
    response, body = post(client, "/api/users", register_data, headers)
    assert response.status_code == http_codes.OK
    assert body["id"] == 2
    assert "password" not in body
    assert "_password" not in body

    # Try to create user with same email
    register_data = {"email": "test1@test.se", "password": "354213", "role_id": 1, "city_id": 1}
    response, body = post(client, "/api/users", register_data, headers)
    assert response.status_code == http_codes.CONFLICT

    # Try login with wrong PASSWORD
    response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc1234"})
    assert response.status_code == http_codes.UNAUTHORIZED

    # Try login with wrong Email
    response, body = post(client, "/api/auth/login", {"email": "testx@test.se", "password": "abc1234"})
    assert response.status_code == http_codes.NOT_FOUND

    # Login with right PASSWORD
    response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc123"})
    assert response.status_code == http_codes.OK

    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get the current user
    response, body = get(client, "/api/users", headers=headers)
    assert response.status_code == http_codes.OK
    assert body["email"] == "test1@test.se"

    # Edit current user name
    response, body = put(client, "/api/users", {"name": "carl carlsson", "city_id": 2, "role_id": 1}, headers=headers)
    assert response.status_code == http_codes.OK
    assert body["name"] == "Carl Carlsson"
    assert body["city_id"] == 2
    assert body["role_id"] == 1

    # Find other user
    response, body = get(
        client,
        "/api/users/search",
        query_string={"name": "Carl Carlsson"},
        headers=headers,
    )
    assert response.status_code == http_codes.OK
    assert len(body) == 1

    # Get user from ID
    searched_user = body[0]
    user_id = searched_user["id"]
    response, body = get(client, f"/api/users/{user_id}", headers=headers)
    assert response.status_code == http_codes.OK
    assert searched_user["name"] == body["name"]
    assert searched_user["email"] == body["email"]
    assert searched_user["role_id"] == body["role_id"]
    assert searched_user["city_id"] == body["city_id"]
    assert searched_user["id"] == body["id"]

    # Login as admin
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Edit user from ID
    response, body = put(client, f"/api/users/{user_id}", {"email": "carl@carlsson.test"}, headers=headers)
    assert response.status_code == http_codes.OK
    # assert body["email"] == "carl@carlsson.test"

    # Edit user from ID but add the same email as other user
    response, body = put(client, f"/api/users/{user_id}", {"email": "test@test.se"}, headers=headers)
    assert response.status_code == http_codes.CONFLICT

    # Delete other user
    response, body = delete(client, f"/api/users/{user_id}", headers=headers)
    assert response.status_code == http_codes.NO_CONTENT

    # Try to delete other user again
    response, body = delete(client, f"/api/users/{user_id}", headers=headers)
    assert response.status_code == http_codes.NOT_FOUND

    # Logout and try to access current user
    response, body = post(client, f"/api/auth/logout", headers=headers)
    assert response.status_code == http_codes.NO_CONTENT

    # TODO: Check if current users jwt (jti) is in blacklist after logging out
    response, body = get(client, "/api/users", headers=headers)
    assert response.status_code == http_codes.UNAUTHORIZED

    # Login in again with default user
    # response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc123"})
    # assert response.status_code == http_codes.OK
    # headers = {"Authorization": "Bearer " + body["access_token"]}

    # # TODO: Add test for refresh api for current user
    # # response, body = post(client, "/api/auth/refresh", headers={**headers, "refresh_token": refresh_token})
    # # assert response.status_code == http_codes.OK

    # # Find current user
    # response, body = get(client, "/api/users", headers=headers)
    # assert response.status_code == http_codes.OK
    # assert body["email"] == "test1@test.se"
    # assert body["city_id"] == 2
    # assert body["role_id"] == 1

    # # Delete current user
    # user_id = body["id"]
    # response, body = delete(client, f"/api/auth/delete/{user_id}", headers=headers)
    # assert response.status_code == http_codes.OK

    # TODO: Check that user was blacklisted
    # Look for current users jwt in blacklist
    # Blacklist.query.filter(Blacklist.jti == )


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_slide_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get slides from empty competition
    CID = 1
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 1

    # Get slides
    CID = 2
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 3

    # Add slide
    response, body = post(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == http_codes.OK

    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert len(body) == 4

    # Get slide
    slide_id = 2
    response, item_slide = get(client, f"/api/competitions/{CID}/slides/{slide_id}", headers=headers)
    assert response.status_code == http_codes.OK

    # Edit slide
    title = "Ny titel"
    body = "Ny body"
    timer = 43
    assert item_slide["title"] != title
    # assert item_slide["body"] != body
    assert item_slide["timer"] != timer
    response, item_slide = put(
        client,
        f"/api/competitions/{CID}/slides/{slide_id}",
        {"title": title, "timer": timer},
        headers=headers,
    )
    assert response.status_code == http_codes.OK
    # assert item_slide["order"] == order
    assert item_slide["title"] == title
    # assert item_slide["body"] == body
    assert item_slide["timer"] == timer

    # Delete slide
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{slide_id}", headers=headers)
    assert response.status_code == http_codes.NO_CONTENT
    # Checks that there are fewer slides
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 3

    # Tries to delete slide again, which will fail
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{slide_id}", headers=headers)
    assert response.status_code != http_codes.OK

    # Get all slides
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == http_codes.OK
    assert len(body) == 3
    assert body[0]["id"] == 3
    assert body[0]["order"] == 0
    slide_id = 3

    """
    # Changes the order to the same order
    response, _ = put(
        client, f"/api/competitions/{CID}/slides/{slide_id}/order", {"order": 0}, headers=headers
    )
    assert response.status_code == http_codes.OK

    # Changes the order
    change_order_test(client, CID, slide_id, slide_id + 1, headers)

    # Copies slide
    for _ in range(10):
        response, _ = post(client, f"/api/competitions/{CID}/slides/{slide_id}/copy", headers=headers)
        assert response.status_code == http_codes.OK
    """

    # Get a specific component
    CID = 2
    SID = 3
    COMID = 2
    response, c1 = get(client, f"/api/competitions/{CID}/slides/{SID}/components/{COMID}", headers=headers)
    assert response.status_code == http_codes.OK

    # Copy the component to another view
    view_type_id = 3
    response, c2 = post(
        client, f"/api/competitions/{CID}/slides/{SID}/components/{COMID}/copy/{view_type_id}", headers=headers
    )
    # Check that the components metch
    assert response.status_code == http_codes.OK
    assert c1 != c2
    assert c1["x"] == c2["x"]
    assert c1["y"] == c2["y"]
    assert c1["w"] == c2["w"]
    assert c1["h"] == c2["h"]
    assert c1["slide_id"] == SID
    assert c2["slide_id"] == SID
    assert c1["type_id"] == c2["type_id"]
    if c1["type_id"] == 1:
        assert c1["text"] == c2["text"]
    elif c1["type_id"] == 2:
        assert c1["image_id"] == c2["image_id"]
    assert c1["view_type_id"] == 1
    assert c2["view_type_id"] == 3


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_question_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    num_questions = 3

    # Add question
    name = "Nytt namn"
    type_id = 2
    slide_order = 6
    response, item_question = post(
        client,
        f"/api/competitions/{3}/slides/{slide_order}/questions",
        {"name": name, "type_id": type_id},
        headers=headers,
    )
    assert response.status_code == http_codes.OK
    assert item_question["name"] == name
    assert item_question["type_id"] == type_id
    num_questions += 1

    """
    # Delete question
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{slide_order}/questions/{QID}", headers=headers)
    num_questions -= 1
    assert response.status_code == http_codes.NO_CONTENT

    # Checks that there are fewer questions
    response, body = get(client, f"/api/competitions/{CID}/questions", headers=headers)
    assert response.status_code == http_codes.OK
    assert body["count"] == num_questions

    # Tries to delete question again
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{NEW_slide_order}/questions/{QID}", headers=headers)
    assert response.status_code == http_codes.NOT_FOUND
    """


@pytest.mark.skipif(DISABLE_TESTS, reason="Only run when DISABLE_TESTS is False")
def test_authorization(client):
    add_default_values()

    # Fake that competition 1 is active
    sockets.active_competitions[1] = {}

    #### TEAM ####
    # Login in with team code
    response, body = post(client, "/api/auth/code", {"code": "111111"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    competition_id = body["competition_id"]
    team_id = body["team_id"]

    # Get competition team is in
    response, body = get(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.OK

    # Try to delete competition team is in
    response, body = delete(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.UNAUTHORIZED

    # Try to get a different competition
    response, body = get(client, f"/api/competitions/{competition_id+1}", headers=headers)
    assert response.status_code == http_codes.UNAUTHORIZED

    # Get own answers
    response, body = get(client, f"/api/competitions/{competition_id}/teams/{team_id}/answers", headers=headers)
    assert response.status_code == http_codes.OK

    # Try to get another teams answers
    response, body = get(client, f"/api/competitions/{competition_id}/teams/{team_id+1}/answers", headers=headers)
    assert response.status_code == http_codes.UNAUTHORIZED

    #### JUDGE ####
    # Login in with judge code
    response, body = post(client, "/api/auth/code", {"code": "222222"})
    assert response.status_code == http_codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    competition_id = body["competition_id"]

    # Get competition judge is in
    response, body = get(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.OK

    # Try to delete competition judge is in
    response, body = delete(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == http_codes.UNAUTHORIZED

    # Try to get a different competition
    response, body = get(client, f"/api/competitions/{competition_id+1}", headers=headers)
    assert response.status_code == http_codes.UNAUTHORIZED

    # Get team answers
    response, body = get(client, f"/api/competitions/{competition_id}/teams/{team_id}/answers", headers=headers)
    assert response.status_code == http_codes.OK

    # Also get antoher teams answers
    response, body = get(client, f"/api/competitions/{competition_id}/teams/{team_id+1}/answers", headers=headers)
    assert response.status_code == http_codes.OK
