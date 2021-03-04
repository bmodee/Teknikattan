from app import db


# Try insert invalid row. If it fails then the test is passed
def assert_insert_fail(type, *args):
    try:
        db.session.add(type(*args))
        db.session.commit()
        assert False
    except:
        db.session.rollback()


def assert_exists(type, length, **kwargs):
    items = type.query.filter_by(**kwargs).all()
    assert len(items) == length
    return items[0]


def assert_object_values(object, dict):
    for k, v in dict.items():
        assert getattr(object, k) == v
