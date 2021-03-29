import json

from app import db


def post(client, url, data, headers=None):
    response = client.post(url, data=json.dumps(data), headers=headers)
    body = json.loads(response.data.decode())
    return response, body


def get(client, url, query_string=None, headers=None):
    response = client.get(url, query_string=query_string, headers=headers)
    body = json.loads(response.data.decode())
    return response, body


def put(client, url, data, headers=None):
    response = client.put(url, data=json.dumps(data), headers=headers)
    body = json.loads(response.data.decode())
    return response, body


def delete(client, url, data, headers=None):
    response = client.delete(url, data=json.dumps(data), headers=headers)
    body = json.loads(response.data.decode())
    return response, body


# Try insert invalid row. If it fails then the test is passed
def assert_insert_fail(db_type, *args):
    try:
        db.session.add(db_type(*args))
        db.session.commit()
        assert False
    except:
        db.session.rollback()


def assert_exists(db_type, length, **kwargs):
    items = db_type.query.filter_by(**kwargs).all()
    assert len(items) == length
    return items[0]


def assert_object_values(obj, values):
    for k, v in values.items():
        assert getattr(obj, k) == v
