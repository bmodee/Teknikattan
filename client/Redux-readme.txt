
This file is a short description of what Redux is,
to learn more about redux, visit https://redux.js.org/


====Install===============================================
To install Redux type the following in the terminal:

npm install redux react-redux
npm install @reduxjs/toolkit

If you have not done so already install axios:

npm install react-axios
npm install axios

Also, a good tool to use is the browser plugin. This allows you to se the state in real time. 
It even has a useful playback feature. install it here:

Chrome:
https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

Firefox:
https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/
=========================================================

What is Redux?

Redux is a pattern and library for managing and updating 
application state, using events called "actions". It serves 
as a centralized store for state that needs to be used 
across your entire application, with rules ensuring that
the state can only be updated in a predictable fashion.

The center of every Redux application is the store. 
A "store" is a container that holds your application's 
global state.

A store is a JavaScript object with a few special functions 
and abilities that make it different than a plain global object:

- You must never directly modify or change the state that is 
kept inside the Redux store

- Instead, the only way to cause an update to the state is to 
create a plain action object that describes "something that 
happened in the application", and then dispatch the action to 
the store to tell it what happened.

- When an action is dispatched, the store runs the root reducer 
function, and lets it calculate the new state based on the old 
state and the action
Finally, the store notifies subscribers that the state has been 
updated so the UI can be updated with the new data.


Redux uses several types of code:
- Actions are plain objects with a type field, and describe 
"what happened" in the app

- Reducers are functions that calculate a new state value 
based on previous state + an action

- A Redux store runs the root reducer whenever an action 
is dispatched

Cite: https://redux.js.org/tutorials/fundamentals/part-1-overview


More useful links on the subject:
https://www.youtube.com/watch?v=CVpUuw9XSjY