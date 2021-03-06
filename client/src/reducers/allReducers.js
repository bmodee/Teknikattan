// Combines all the reducers so that we only have to pass "one" reducer to the store in src/index.tsx


import { combineReducers } from 'redux';
import loggedInReducer from './isLoggedIn';

const allReducers = combineReducers({
    // name: state
    isLoggedIn: loggedInReducer // You can write "loggedInReducer" because its the same as "loggedInReducer: loggedInReducer"
});
export default allReducers;