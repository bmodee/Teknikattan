# Installation

It is recommended to use [Visual Studio Code](https://code.visualstudio.com/) to install and use the server, but it is not necessary.
In order to install the server, you will need to do the following:

Install [Python](https://www.python.org/downloads/).

Clone [teknikattan-scoring-system](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system).

Open a terminal and navigate to the root of the cloned project.

Install virtualenv and create a virtual environment:

```
pip install virtualenv
cd server
py -m venv env
```

Activate the virtual environment (which is done slightly differently on Windows and Linux/Mac):

On Windows:

```
Set-ExecutionPolicy Unrestricted -Scope Process
./env/Scripts/activate
```

On Linux/Mac:

```
source env/bin/activate
```

Install all project depencies:

```
pip install -r requirements.txt
```

You should now be ready to start the server.
Try it by running `python main.py` and navigate to `localhost:5000`.
If everything worked as it should you should see a list of all available API calls.

Continue to [Development](development.md).
