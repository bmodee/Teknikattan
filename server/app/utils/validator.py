from cerberus import Validator


def validate_object(schema, obj, allow_unknown=False):
    v = Validator(schema, allow_unknown)
    if not v.validate(obj):
        return v.errors


_email_regex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"

login_schema = {
    "email": {"type": "string", "required": True, "regex": _email_regex},
    "password": {"type": "string", "required": True, "minlength": 6, "maxlength": 128},
}

register_schema = {
    "email": {"type": "string", "required": True, "regex": _email_regex},
    "password": {"type": "string", "required": True, "minlength": 6, "maxlength": 128},
    "role": {"type": "string", "required": True},
    "city": {"type": "string", "required": True},
}

edit_user_schema = {
    "name": {"type": "string", "required": False, "minlength": 1, "maxlength": 50},
}
