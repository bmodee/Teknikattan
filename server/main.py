import sys

from app import create_app

"""
Action-arg1:    server(default), populate
Mode-arg2:      dev(default), prod, test
Database-arg3:  lite(default), postgre
"""

if __name__ == "__main__":
    argv = sys.argv

    # action = argv[1] if len(argv) > 1 else "server"
    mode = argv[1] if len(argv) > 1 else "dev"
    # database = argv[3] if len(argv) > 3 else "lite"

    # if mode == "prod":
    # database = "postgre"

    if mode == "dev" or mode == "test":
        database = argv[2] if len(argv) > 2 else "lite"
    elif mode == "prod":
        database = "postgre"
    else:
        print("Invalid args")
        print("Dev args: no args, 'dev lite' or 'dev postgre'")
        print("Prod args: 'prod'\n")
        sys.exit(-1)

    print(f"Starting server in {mode} mode with database {database}...")
    app, sio = create_app(mode, database)
    sio.run(app)
