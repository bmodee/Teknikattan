import random
import re
import string

CODE_LENGTH = 6
ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
CODE_RE = re.compile(f"^[{ALLOWED_CHARS}]{{{CODE_LENGTH}}}$")


def generate_code_string():
    return "".join(random.choices(ALLOWED_CHARS, k=CODE_LENGTH))


def verify_code(c):
    return CODE_RE.search(c.upper()) is not None
