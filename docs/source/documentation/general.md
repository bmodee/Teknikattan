# Generating this document

To generate this document you need to do a few things.

You will need to install `make`.
If you are on Linux you probably already have it installed and can skip the two following steps.
If you are on Windows you need to do the following:

Download and install [Chocolatey](https://chocolatey.org/install).

Install `make` using Chocolatey (open PowerShell as administrator):

```bash
choco install make
```

You also need to [install the server](../installation/server.md).

You should now be able to generate the documentation by activating the Python virtual environment, navigating to `docs/` and running `make html`.
Alternatively you can also run the [VSCode task](../development/vscode.html#tasks) `Generate server documentation`, which will do the same thing.
If everything went well you should be able to open it by running (from the `docs/` folder) `start ./build/html/index.html` or running the task `Open documentation`, which does the same thing.
