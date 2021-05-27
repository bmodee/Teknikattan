# Server

This document describes how to install and run the server.

## Installing

You will need to do the following things to install the server:

1. Install [Visual Studio Code](https://code.visualstudio.com/) (VS Code).
2. Install [Python](https://www.python.org/downloads/).
3. Install [pip](https://pip.pypa.io/en/stable/installing/) (should already be installed with python)
4. Clone this repository if you haven't done so already.
5. Open the project folder in VS Code.
6. Open the integrated terminal by pressing `ctrl+ö`.
7. Type the following commands into your terminal:

### Windows

```bash
# Install virtualenv package. You may need to open as administrator if you get
# permission denied.
pip install virtualenv

# Go into the server folder.
cd server

# Create a python virtual environment. If it can't find Python, try
# python or py -3 instead of py.
py -m venv env

# Prevent unauthorized error when running virtual environment in Windows.
Set-ExecutionPolicy Unrestricted -Scope Process

# Activate the virtual environment.
./env/Scripts/activate

# Install all the required packages into your virtual environment.
pip install -r requirements.txt
```

### Linux(Ubuntu)

```bash
# Install pip
sudo apt-get install python-pip

# Install virtualenv package.
sudo apt install python3-venv

# Go into the server folder.
cd server

# Create a python virtual environment. If it can't find python3, try
# python or py -3 instead of python3.
python3 -m venv env

# Activate the virtual environment.
source env/bin/activate

# Install all the required packages into your virtual environment.
# If pip don't work try pip3 instead
pip install -r requirements.txt

```

The last step is to install all the required packages.
If you are running it in production, run `pip install -r requirements.txt`.
But if you are a developer, run `pip install -r requirements-dev.txt`.

## Common problems

### Make sure python 3 is running with the python command

```
py --version
or
python --version

- If the version is < 3 try the following commands

py3 or python3
```

### Make sure pip is running with python 3

```
pip --version
Should return something similar to (these stats work on my system):
-> pip 19.2.3 from PATH (python 3.8)

If it says python < 3, try:
pip3 --version
```

This [guide](https://pip.pypa.io/en/stable/installing/)
can help you upgrade pip

### Problem: Failed building wheel for xyz when calling pip

```
pip install wheel
```

This [guide](https://stackoverflow.com/questions/53204916/what-is-the-meaning-of-failed-building-wheel-for-x-in-pip-install)
can help you troubleshoot this problem

## Using

After you have done every step described in setup, you are ready to start the server.
To see the tasks described in the following steps, press `ctrl+shift+b`.

### Populating database

Populate database by running the `Populate database` task. (populate.py)

### Starting

Start the server by running the `Start server` task. (main.py)

### Testing

Run the client tests running the `Test server` task.

Or run manually with:

```
pytest --cov-report html --cov app tests/
```

After it has finished, you can view a coverage report.
This is done by running the `Open server coverage` task.
Or run manually with:

```
start ./htmlcov/index.html
```

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
