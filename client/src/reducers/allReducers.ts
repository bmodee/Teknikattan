// Combines all the reducers so that we only have to pass "one" reducer to the store in src/index.tsx

import { combineReducers } from 'redux'
import citiesReducer from './citiesReducer'
import competitionsReducer from './competitionsReducer'
import uiReducer from './uiReducer'
import userReducer from './userReducer'

const allReducers = combineReducers({
  // name: state
  user: userReducer,
  UI: uiReducer,
  competitions: competitionsReducer,
  cities: citiesReducer,
})
export default allReducers
