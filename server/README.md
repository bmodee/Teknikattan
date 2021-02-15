# Server

This document describes how to install and run the server.

## Installing

You will need to do the following things to install the server:

1. Install [Visual Studio Code](https://code.visualstudio.com/) (VSCode).
2. Install [Python](https://www.python.org/downloads/).
3. Clone this repository if you haven't done so already.
4. Open the project folder in VSCode.
5. Open the integrated terminal by pressing `ctrl+ö`.
6. Type the following commands (or if you are on Windows, simply paste them) into your terminal:

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
# You migt to run the following before activating the virtual environment.
Set-ExecutionPolicy Unrestricted -Scope Process
./env/Scripts/activate

# Linux/Mac
# source env/bin/activate

# Install all the required packages into your virtual environment.
pip install -r requirements.txt
```

## Using

After you have done every step described in setup, you are ready to run the server.
You can either run the server using tasks (recommended) or run it directly in the terminal.

### Tasks

You can run the server using Visual Studio Code tasks.
This is done by pressing `ctrl+shift+b` and running the `Server` task.

### Terminal

You can also run the server and tests directly from the terminal.
Before doing anything in the terminal, you need to activate the Python virtual environment (see Setup).
All of the following snippets assume you are in the `server` folder.

Running the server:

```bash
python main.py
```

Running the tests:

```bash
python test.py
```

Adding new packages:

```bash
pip install new_package
pip freeze > requirements.txt
```
