from app import create_app, db
import unittest
import json


class Test(unittest.TestCase):
    def setUp(self):
        """Before each test, set up a blank database"""
        self.app = create_app("configmodule.TestingConfig")
        self.app.testing = True

        self.client = self.app.test_client()

        with self.app.app_context():
            db.drop_all()
            db.create_all()

    # Called after every test
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_user(self):
        # Create user
        rv = self.client.post(
            "/api/users/",
            data=json.dumps({"email": "test@test.se", "password": "abc123"}),
        )
        rv_dict = json.loads(rv.data.decode())

        assert rv.status_code == 200
        assert rv_dict["id"] == 1
        assert "password" not in rv_dict
        assert rv_dict["email"] == "test@test.se"

        # Try loggin with wrong PASSWORD
        rv = self.client.post("/api/users/login", data=json.dumps({"email": "test@test.se", "password": "abc1234"}))
        assert rv.status_code == 401

        # Try loggin with wrong Email
        rv = self.client.post("/api/users/login", data=json.dumps({"email": "test1@test.se", "password": "abc1234"}))
        assert rv.status_code == 401

        # Try loggin with right PASSWORD
        rv = self.client.post("/api/users/login", data=json.dumps({"email": "test@test.se", "password": "abc123"}))
        rv_dict = json.loads(rv.data.decode())
        assert rv.status_code == 200
        headers = {"Authorization": "Bearer " + rv_dict["access_token"]}

        # Get the current user
        rv = self.client.get("/api/users/", headers=headers)
        rv_dict = json.loads(rv.data.decode())
        assert rv.status_code == 200
        assert rv_dict["email"] == "test@test.se"

        rv = self.client.put("/api/users/", data=json.dumps({"name": "carl carlsson"}), headers=headers)
        rv_dict = json.loads(rv.data.decode())
        assert rv.status_code == 200
        assert rv_dict["name"] == "Carl Carlsson"

    def test_empty(self):
        # Try loggin withou any users
        rv = self.client.post("/api/users/login", data=json.dumps({"email": "test@test.se", "password": "abc123"}))
        assert rv.status_code == 401


if __name__ == "__main__":
    unittest.main()
