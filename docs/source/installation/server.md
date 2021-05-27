# Installing the server

The steps to install the server depend on if you are on Windows or Linux and if you are a developer or are running it in production.

## Windows

Clone the Git [repository](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system):

```bash
git clone https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system
cd ./teknikattan-scoring-system/
```

Install [Python](https://www.python.org/downloads/).

Make sure `Python` is [installed properly](#running-python).

Make sure `pip` is [installed properly](#running-pip).

Install virtualenv and create a virtual environment:

```bash
pip install virtualenv
cd server
py -m venv env
```

Activate the virtual environment:

```bash
Set-ExecutionPolicy Unrestricted -Scope Process
./env/Scripts/activate
```

Continue to [development and production](#development-and-production).

## Linux (Ubuntu)

Clone the Git [repository](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system):

```bash
git clone https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system
cd ./teknikattan-scoring-system/
```

Install [Python](https://www.python.org/downloads/).

Make sure `Python` is [installed properly](#running-python).

Install pip:

```bash
sudo apt install python3-pip
```

Make sure `pip` is [installed properly](#running-pip).

Install and create a Python virutal environment and activate it:

```bash
sudo apt install python3-venv
cd server
py -m venv env
source env/bin/activate
```

Continue to [development and production](#development-and-production).

## Development and production

Which dependencies you install will depend on if you are a developer or running the server in production.

If running in production:

```bash
pip install -r requirements.txt
```

If you are a developer:

```bash
pip install -r requirements-dev.txt
```

You should now be ready to start the server.
Try it by running `py main.py` and navigate to `localhost:5000`.
If everything worked as it should you should see a list of all available API calls.
If you are using VS Code you can also start the server with the [task](../development/vscode.md) `start server`.

## Common issues

If you have any issues while installing, some of the things below might help.

### Running Python

Test that Python is installed properly:

```bash
py --version
```

Make sure Python version > 3.
If it works, you should see something along the lines of:

```bash
Python 3.9.4
```

If `py` is not working, try one of the following instead:

```
py -3
py3
python
python3
```

### Running pip

Test that `pip` is installed properly:

```bash
pip --version
```

Make sure pip is running with Python 3.x (not Python 2.x).
If everything works, it should look something along the lines of:

```
pip 20.2.3 from d:\home\workspace\teknikattan-scoring-system\server\env\lib\site-packages\pip (python 3.9)
```

If `pip` is not running with Python 3.x, try one of the following instead:

```
pip3
py -m pip
```

If you still have trouble, try this [guide](https://pip.pypa.io/en/stable/installing/).

### Problem: Failed building wheel for \<package\> when calling pip

Run the following command before installing the requirements:

```
pip install wheel
```

This [guide](https://stackoverflow.com/questions/53204916/what-is-the-meaning-of-failed-building-wheel-for-x-in-pip-install)
can help you troubleshoot this problem further.

### Problem: psycopg

```
pip install psycopg2
```
