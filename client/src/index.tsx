import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore } from 'redux'
import App from './App'
import './index.css'
import allReducers from './reducers/allReducers'
import reportWebVitals from './reportWebVitals'

/*
  TypeScript does not know the type of the property. 
  Therefore, you will get the error; Property ‘__REDUX_DEVTOOLS_EXTENSION_COMPOSE__’ 
  does not exist on type ‘Window’. Hence, you need to add the property to the global window as below.
*/
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: typeof compose
  }
}

// Create an Advanced global store with the name "store"
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // allows Mozilla plugin to view state in a GUI, https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm
// const store = createStore(allReducers, composeEnhancers(applyMiddleware()))

// simple store with plugin
const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// Provider wraps the app component so that it can access store
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
