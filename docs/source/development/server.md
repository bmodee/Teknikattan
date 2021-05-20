# Backend

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
