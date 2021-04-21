import app.core.http_codes as codes
from app.database.models import Slide

from tests import app, client, db
from tests.test_helpers import add_default_values, change_order_test, delete, get, post, put


def test_misc_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get types
    response, body = get(client, "/api/misc/types", headers=headers)
    assert response.status_code == codes.OK
    assert len(body["media_types"]) >= 2
    assert len(body["question_types"]) >= 3
    assert len(body["component_types"]) >= 2
    assert len(body["view_types"]) >= 2

    ## Get misc
    response, body = get(client, "/api/misc/roles", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] >= 2

    response, body = get(client, "/api/misc/cities", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] >= 2
    assert body["items"][0]["name"] == "Linköping" and body["items"][1]["name"] == "Testköping"

    ## Cities
    response, body = post(client, "/api/misc/cities", {"name": "Göteborg"}, headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] >= 2 and body["items"][2]["name"] == "Göteborg"

    # Rename city
    response, body = put(client, "/api/misc/cities/3", {"name": "Gbg"}, headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] >= 2 and body["items"][2]["name"] == "Gbg"

    # Delete city
    # First checks current cities
    response, body = get(client, "/api/misc/cities", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] >= 3
    assert body["items"][0]["name"] == "Linköping"
    assert body["items"][1]["name"] == "Testköping"
    assert body["items"][2]["name"] == "Gbg"

    # Deletes city
    response, body = delete(client, "/api/misc/cities/3", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] >= 2
    assert body["items"][0]["name"] == "Linköping" and body["items"][1]["name"] == "Testköping"


def test_competition_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Create competition
    data = {"name": "c1", "year": 2020, "city_id": 1}
    response, body = post(client, "/api/competitions", data, headers=headers)
    assert response.status_code == codes.OK
    assert body["name"] == "c1"
    competition_id = body["id"]

    # Get competition
    response, body = get(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == codes.OK
    assert body["name"] == "c1"

    response, body = post(client, f"/api/competitions/{competition_id}/slides", headers=headers)
    assert response.status_code == codes.OK

    response, body = get(client, f"/api/competitions/{competition_id}/slides", headers=headers)
    assert response.status_code == codes.OK
    assert len(body["items"]) == 3

    response, body = put(client, f"/api/competitions/{competition_id}/slides/{2}/order", {"order": 1}, headers=headers)
    assert response.status_code == codes.OK

    response, body = post(client, f"/api/competitions/{competition_id}/teams", {"name": "t1"}, headers=headers)
    assert response.status_code == codes.OK

    response, body = get(client, f"/api/competitions/{competition_id}/teams", headers=headers)
    assert response.status_code == codes.OK
    assert len(body["items"]) == 1
    assert body["items"][0]["name"] == "t1"

    response, body = delete(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == codes.OK

    # Get competition
    competition_id = 2
    response, body = get(client, f"/api/competitions/{competition_id}", headers=headers)
    assert response.status_code == codes.OK

    # Copies competition
    for _ in range(10):
        response, _ = post(client, f"/api/competitions/{competition_id}/copy", headers=headers)
        assert response.status_code == codes.OK


def test_auth_and_user_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Create user
    register_data = {"email": "test1@test.se", "password": "abc123", "role_id": 2, "city_id": 1}
    response, body = post(client, "/api/auth/signup", register_data, headers)
    assert response.status_code == codes.OK
    assert body["id"] == 2
    assert "password" not in body
    assert "_password" not in body

    # Try to create user with same email
    register_data = {"email": "test1@test.se", "password": "354213", "role_id": 1, "city_id": 1}
    response, body = post(client, "/api/auth/signup", register_data, headers)
    assert response.status_code == codes.BAD_REQUEST

    # Try loggin with wrong PASSWORD
    response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc1234"})
    assert response.status_code == codes.UNAUTHORIZED

    # Try loggin with wrong Email
    response, body = post(client, "/api/auth/login", {"email": "testx@test.se", "password": "abc1234"})
    assert response.status_code == codes.UNAUTHORIZED

    # Try loggin with right PASSWORD
    response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc123"})
    assert response.status_code == codes.OK
    refresh_token = body["refresh_token"]
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get the current user
    response, body = get(client, "/api/users", headers=headers)
    assert response.status_code == codes.OK
    assert body["email"] == "test1@test.se"

    # Edit current user name
    response, body = put(client, "/api/users", {"name": "carl carlsson", "city_id": 2, "role_id": 1}, headers=headers)
    assert response.status_code == codes.OK
    assert body["name"] == "Carl Carlsson"
    assert body["city_id"] == 2 and body["role_id"] == 1

    # Find other user
    response, body = get(
        client,
        "/api/users/search",
        query_string={"name": "Carl Carlsson"},
        headers=headers,
    )
    assert response.status_code == codes.OK
    assert body["count"] == 1

    # Get user from ID
    searched_user = body["items"][0]
    user_id = searched_user["id"]
    response, body = get(client, f"/api/users/{user_id}", headers=headers)
    assert response.status_code == codes.OK
    assert searched_user["name"] == body["name"]
    assert searched_user["email"] == body["email"]
    assert searched_user["role_id"] == body["role_id"]
    assert searched_user["city_id"] == body["city_id"]
    assert searched_user["id"] == body["id"]

    # Login as admin
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Edit user from ID
    response, body = put(client, f"/api/users/{user_id}", {"email": "carl@carlsson.test"}, headers=headers)
    assert response.status_code == codes.OK
    # assert body["email"] == "carl@carlsson.test"

    # Edit user from ID but add the same email as other user
    response, body = put(client, f"/api/users/{user_id}", {"email": "test@test.se"}, headers=headers)
    assert response.status_code == codes.BAD_REQUEST

    # Delete other user
    response, body = delete(client, f"/api/auth/delete/{user_id}", headers=headers)
    assert response.status_code == codes.OK

    # Try to delete other user again
    response, body = delete(client, f"/api/auth/delete/{user_id}", headers=headers)
    assert response.status_code == codes.NOT_FOUND

    # Logout and try to access current user
    response, body = post(client, f"/api/auth/logout", headers=headers)
    assert response.status_code == codes.OK

    # TODO: Check if current users jwt (jti) is in blacklist after logging out

    response, body = get(client, "/api/users", headers=headers)
    assert response.status_code == codes.UNAUTHORIZED

    # Login in again with default user
    # response, body = post(client, "/api/auth/login", {"email": "test1@test.se", "password": "abc123"})
    # assert response.status_code == codes.OK
    # headers = {"Authorization": "Bearer " + body["access_token"]}

    # # TODO: Add test for refresh api for current user
    # # response, body = post(client, "/api/auth/refresh", headers={**headers, "refresh_token": refresh_token})
    # # assert response.status_code == codes.OK

    # # Find current user
    # response, body = get(client, "/api/users", headers=headers)
    # assert response.status_code == codes.OK
    # assert body["email"] == "test1@test.se"
    # assert body["city_id"] == 2
    # assert body["role_id"] == 1

    # # Delete current user
    # user_id = body["id"]
    # response, body = delete(client, f"/api/auth/delete/{user_id}", headers=headers)
    # assert response.status_code == codes.OK

    # TODO: Check that user was blacklisted
    # Look for current users jwt in blacklist
    # Blacklist.query.filter(Blacklist.jti == )


def test_slide_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get slides from empty competition
    CID = 1
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == 1

    # Get slides
    CID = 2
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == 3

    # Add slide
    response, body = post(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == 4
    # Add another slide
    response, body = post(client, f"/api/competitions/{CID}/slides", headers=headers)

    # Get slide
    slide_order = 1
    response, item_slide = get(client, f"/api/competitions/{CID}/slides/{slide_order}", headers=headers)
    assert response.status_code == codes.OK
    assert item_slide["order"] == slide_order

    # Edit slide
    order = 6
    title = "Ny titel"
    body = "Ny body"
    timer = 43
    assert item_slide["order"] != order
    assert item_slide["title"] != title
    # assert item_slide["body"] != body
    assert item_slide["timer"] != timer
    response, item_slide = put(
        client,
        f"/api/competitions/{CID}/slides/{slide_order}",
        # TODO: Implement so these commented lines can be edited
        # {"order": order, "title": title, "body": body, "timer": timer},
        {"title": title, "timer": timer},
        headers=headers,
    )
    assert response.status_code == codes.OK
    # assert item_slide["order"] == order
    assert item_slide["title"] == title
    # assert item_slide["body"] == body
    assert item_slide["timer"] == timer

    # Delete slide
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{slide_order}", headers=headers)
    assert response.status_code == codes.NO_CONTENT
    # Checks that there are fewer slides
    response, body = get(client, f"/api/competitions/{CID}/slides", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == 4

    # Tries to delete slide again, should work since the order is now changed
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{slide_order}", headers=headers)
    assert response.status_code == codes.NO_CONTENT

    # Changes the order to the same order
    slide_order = body["items"][0]["order"]
    response, _ = put(
        client, f"/api/competitions/{CID}/slides/{slide_order}/order", {"order": slide_order}, headers=headers
    )
    assert response.status_code == codes.OK

    # Changes the order
    change_order_test(client, CID, slide_order, slide_order + 1, headers)

    # Copies slide
    for _ in range(10):
        response, _ = post(client, f"/api/competitions/{CID}/slides/{slide_order}/copy", headers=headers)
        assert response.status_code == codes.OK


def test_question_api(client):
    add_default_values()

    # Login in with default user
    response, body = post(client, "/api/auth/login", {"email": "test@test.se", "password": "password"})
    assert response.status_code == codes.OK
    headers = {"Authorization": "Bearer " + body["access_token"]}

    # Get questions from empty competition
    CID = 1  # TODO: Fix api-calls so that the ones not using CID don't require one
    slide_order = 1
    response, body = get(client, f"/api/competitions/{CID}/questions", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == 0

    # Get questions from another competition that should have some questions
    CID = 3
    num_questions = 3
    response, body = get(client, f"/api/competitions/{CID}/questions", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == num_questions

    # Add question
    name = "Nytt namn"
    type_id = 2
    slide_order = 1
    response, item_question = post(
        client,
        f"/api/competitions/{CID}/slides/{slide_order}/questions",
        {"name": name, "type_id": type_id},
        headers=headers,
    )
    num_questions = 4
    assert response.status_code == codes.OK
    assert item_question["name"] == name
    assert item_question["type_id"] == type_id

    # Checks number of questions
    response, body = get(client, f"/api/competitions/{CID}/questions", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == num_questions
    """
    # Delete question
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{slide_order}/questions/{QID}", headers=headers)
    num_questions -= 1
    assert response.status_code == codes.NO_CONTENT

    # Checks that there are fewer questions
    response, body = get(client, f"/api/competitions/{CID}/questions", headers=headers)
    assert response.status_code == codes.OK
    assert body["count"] == num_questions

    # Tries to delete question again
    response, _ = delete(client, f"/api/competitions/{CID}/slides/{NEW_slide_order}/questions/{QID}", headers=headers)
    assert response.status_code == codes.NOT_FOUND
    """
