# System overview

The system has a fairly simple design, as depicted in the image below.
The terms frontend and client as well as backend and server will be used interchangeably.

![Systemöversikt](../_static/system_overview.svg)

First there is the main server which is written in Python using the micro-framework Flask.
Then there is a fairly small Node server with only one function, to serve the React frontend pages.
Lastly there is the frontend which is written in TypeScript using React and Redux.

## Communication

The frontend communicates with the backend in two ways, both of which are authorized on the server.
This is to make sure that whoever tries to communicate has the correct level of access.

### API

API calls are used for simple functions that the client wants to perform, such as getting, editing, and saving data.
These are sent from the client to the backend Node server that will forward the request to the main Python server.
The request will then be handled there and the response will be sent back.
The Node server will then send them back to the client.

### Sockets

The client can also communicate directly with the server via sockets.
These are suited for fast real time communication.
Thus they are used during an active presentation to sync things between different views such as current slide and timer.
