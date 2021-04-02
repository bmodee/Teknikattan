import { AnyAction, applyMiddleware, compose, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import allReducers from './reducers/allReducers'
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

const initialState = {}
const middleware = [thunk]
// Create an Advanced global store with the name "store"
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // allows Mozilla plugin to view state in a GUI, https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm
// const store = createStore(allReducers, composeEnhancers(applyMiddleware()))

// simple store with plugin
const store = createStore(allReducers, initialState, composeWithDevTools(applyMiddleware(...middleware)))
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>

export default store
