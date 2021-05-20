# Server

This document describes how to install and run the server.

## Installing

You will need to do the following things to install the server:

1. Install [Visual Studio Code](https://code.visualstudio.com/) (VS Code).
2. Install [Python](https://www.python.org/downloads/).
3. Clone this repository if you haven't done so already.
4. Open the project folder in VS Code.
5. Open the integrated terminal by pressing `ctrl+ö`.
6. Type the following commands into your terminal:

```bash
# Install virtualenv package. You may need to open as administrator if you get
# permission denied.
pip install virtualenv

# Go into the server folder.
cd server

# Create a python virtual environment. If it can't find Python, try
# python or py -3 instead of py.
py -m venv env

# Activate the virtual environment.
# This step is different depending on your operating system.

# Windows
Set-ExecutionPolicy Unrestricted -Scope Process
./env/Scripts/activate
# =====

# Linux/Mac
source env/bin/activate
# =====

# Install all the required packages into your virtual environment.
pip install -r requirements.txt
```

## Using

After you have done every step described in setup, you are ready to start the server.
To see the tasks described in the following steps, press `ctrl+shift+b`.

### Starting

Start the server by running the `Start server` task.

### Testing

Run the client tests running the `Test server` task.

After it has finished, you can view a coverage report.
This is done by running the `Open server coverage` task.

### Adding and removing new packages

All of the following snippets assume you are in the `server` folder and have activated the virtual environment (see Setup).

Installing new package:

```bash
pip install <package>
```

Uninstalling package:

```bash
pip uninstall <package>
```

If you have added or removed a package from the repository, you will also have to run the following before commiting it to git:

```bash
pip freeze > requirements.txt
```

Whenever a new package is installed, commited and pushed to git, everyone else needs to run `pip install -r requirements.txt` after pulling to install it as well.
