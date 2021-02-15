# Client

This documents describes how to install and run the client.

## Installing

You will need to do the following things to install the client:

1. Install [Visual Studio Code](https://code.visualstudio.com/) (VSCode).
2. Install [Node (LTS)](https://nodejs.org/en/).
3. Clone this repository if you haven't done so already.
4. Open the project folder in VSCode.
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
You can either start the client using tasks (recommended) or start it directly in the terminal.

### Tasks

You can run the client using Visual Studio Code tasks.
This is done by pressing `ctrl+shift+b` and running the `Client` task.

### Terminal

You can also run the client directly from the terminal.
All of the following snippets assume you are in the `client` folder.

Running the client:

```bash
npm run start
```

Installing new modules:

```bash
npm install new_module
```

Whenever a new module is installed, commited and pushed to git, everyone else needs to run `npm install` after pulling to install it as well.

Author: Victor Löfgren

Last updated: 11 February 2020
