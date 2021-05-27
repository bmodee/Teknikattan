# Backend

## Arguments when running backend

When running main.py several arguments can be used

```
arg1(action):    server(default), populate
arg2(mode):      dev(default), prod
arg3(database):  lite(default), postgre

```

### Running server

```
main.py -> same as below
main.py server dev lite -> Run server in dev-mode with sql-lite

main.py server prod postgre -> Run server in production-mode with postgresql

```

### Populating backend

```
main.py populate dev lite -> Populate database in dev-mode with sql-lite
main.py populate prod postgre -> Populate database in production-mode with postgresql
```

## Working with Python

In this section we briefly describe how to work with Python.

### Virtual environments

Python virtual environments are used to isolate packages for each project from each other.
When [installing the server](../installation/server.md) you installed `virtualenv` and created and activated a virtual environment.

### Pip

Python uses `pip` to manage it's packages.
Here we briefly describe to use it.
All of the following instructions assume you have created and activated a virtual environment and are located in the server folder.

To install a package, run `pip install <package>`.

To uninstall a package, run `pip uninstall <package>`.

To save a package as a dependency to the project, run `pip freeze > requirements.txt`.

To install all project dependencies, run `pip install -r requirements.txt`.

Remember to install the project dependencies whenever you or someone else has added new ones to the project.
