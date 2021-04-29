# Development

In this section we give all the instructions necessary to continue the development of this project.
We also give some recommentations for how to go about it and some ides for how to improve it.

## Working with Python

In this section we briefly describe how to work with Python.

### Virtual environments

Python virtual environments are used to isolate packages for each project from each other.
In the [Installation](installation.md) you installed `virtualenv` and created and activated a virtual environment.

### Pip

Python uses `pip` to manage it's packages.
Here we briefly describe to use it.
All of the following instructions assume you have created and activated a virtual environment.

To install a package, run `pip install <package>`.

To uninstall a package, run `pip uninstall <package>`.

To save a package as a dependency to the project, run `pip freeze > requirements.txt`.

To install all project dependencies, run `pip install -r requirements.txt`.

## Visual Studio Code

The development of this project was mainly done using Visual Studio Code (VSCode).
It is not that surprising, then, that we recommend you use it.

### Tasks

A task in VSCode is a simple action that can be run by pressing `ctrl+shift+p` and selecting `Tasks: Run Task`.
A few such tasks has been setup in this project and tasks related to the server will be described below.

The `Start server` task will start the server.

The `Populate database` task will populate the database with a few competitions, teams, users and such.

The `Test server` task will run the server tests located in the `tests/` folder.

The `Open server coverage` can only be run after running the server tests and will open the coverage report generated by those tests in a webbrowser.

The `Generate server documentation` will generate the server documentation, i.e. this document, in the `docs/build/html/` folder.

The `Open server documentation` can only be run after generating the documentation and will open it in a webbrowser.

## Further development

Because the project was time limited a lot is left to be done.
A few ideas for things to be improved are given here.

### Replacing reqparse

As mention in the [Parsing request](overview.md#Parsing-request), the reqparse module from RestX is deprecated and should be replaced with for example marsmallow.
Parsing is a rather small and simple matter which makes it quite fine not to use the most optimal tool, but it should nevertheless be replaced.