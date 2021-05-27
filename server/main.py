import sys

from app import create_app, db
from populate import create_default_items

"""
Action-arg1:    server(default), populate
Mode-arg2:      dev(default), prod
Database-arg3:  lite(default), postgre
"""


def start_server(mode, database):
    print(f"Starting server in {mode} mode with database {database}...")
    app, sio = create_app(mode, database)
    sio.run(app)


def populate_server(mode, database):
    print(f"Populating server in {mode} mode with database {database}...")
    app, _ = create_app(mode, database)

    with app.app_context():
        db.drop_all()
        db.create_all()
        create_default_items()

    print("Task populate done")


if __name__ == "__main__":
    argv = sys.argv

    action = argv[1] if len(argv) > 1 else "server"
    mode = argv[2] if len(argv) > 2 else "dev"
    database = argv[3] if len(argv) > 3 else "lite"

    if mode == "prod":
        database = "postgre"

    if action == "server":
        start_server(mode, database)
    elif action == "populate":
        populate_server(mode, database)
