from requests import *
import json

HOST = "http://localhost:5000/"


def _post(url: str, jdict: dict):
    post(HOST + url, json.dumps(jdict))


def asdasd(i: int):
    return i


print("Populate default database data")

_post("user/", {"email": "admin@test.com", "password": "password", "name": "Admin Adminsson"})
