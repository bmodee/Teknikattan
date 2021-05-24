# Generating documentation for the client

To generate documentation for the client you first need to [install the client](../installation/client.md).

After that you will be able to generate the documentation by running:

```bash
cd client/
typedoc
```

You will then able to open it by running:

```bash
start ./docs/index.html
```

If you want to include the documentation from the tests, go to the file `client/tsconfig.json` and comment out the line `"exlude": "**/*.test.*"`.
