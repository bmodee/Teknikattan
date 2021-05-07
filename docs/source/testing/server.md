# Testing the server

The Python testing framework used to test the server is [pytest](https://docs.pytest.org/).

The server tests are located in the folder `./server/tests`.
The tests are further divided into files that test the database `test_db.py` and test the api `test_api.py`.

The file `test_helpers.py` is used to store some common functionality between the tests, such as adding default values to the database.
There are also some functions that makes using the api easier, such as the `get`, `post` and `delete` functions.

Run the tests by running the [VSCode task](../development/vscode.html#tasks) `Test server`.
After that you can see what has been tested by opening the server coverage using the task `Open server coverage`.
