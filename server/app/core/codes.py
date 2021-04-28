"""
Contains all functions purely related to creating and verifying a code.
"""

import random
import re
import string

CODE_LENGTH = 6
ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
CODE_RE = re.compile(f"^[{ALLOWED_CHARS}]{{{CODE_LENGTH}}}$")


def generate_code_string() -> str:
    """Generates a 6 character long random sequence containg uppercase letters
    and numbers.
    """
    return "".join(random.choices(ALLOWED_CHARS, k=CODE_LENGTH))


def verify_code(code: str) -> bool:
    """Returns True if code only contains letters and/or numbers
    and is exactly 6 characters long."""
    return CODE_RE.search(code.upper()) is not None
