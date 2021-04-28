"""
The controller subpackage provides a simple interface to the database. It 
exposes methods to simply add, copy, delete, edit, get and search for items.
"""

from app.core import db
from app.database.controller import add, copy, delete, edit, get, search, utils
