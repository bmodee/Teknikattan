# Client

This documents describes how to install and run the client.

## Installing

You will need to do the following things to install the client:

1. Install [Visual Studio Code](https://code.visualstudio.com/) (VS Code).
2. Install [Node (LTS)](https://nodejs.org/en/).
3. Clone this repository if you haven't done so already.
4. Open the project folder in VS Code.
5. Open the integrated terminal by pressing `ctrl+ö`.
6. Type the following commands (or simply paste them) into your terminal:

```bash
# Go into the client directory.
cd client

# Install all dependencies.
npm install
```

## Using

After you have done every step described in setup, you are ready to start the client.
To see the tasks described in the following steps, press `ctrl+shift+b`.

### Starting

Start the server by running the `Start client` task.

### Testing

Run the client tests running the `Test client` task.

After it has finished, you can view a coverage report.
This is done by running the `Open client coverage` task.

### Adding and removing new modules

All of the following snippets assume you are in the `client` folder.

Installing new module:

```bash
npm install <module>
```

Uninstalling module:

```bash
npm uninstall <module>
```

Whenever a new module is installed, commited and pushed to git, everyone else needs to run `npm install` after pulling to install it as well.
