// Combines all the reducers so that we only have to pass "one" reducer to the store in src/index.tsx

import { combineReducers } from 'redux'
import citiesReducer from './citiesReducer'
import competitionLoginReducer from './competitionLoginReducer'
import competitionsReducer from './competitionsReducer'
import editorReducer from './editorReducer'
import mediaReducer from './mediaReducer'
import presentationReducer from './presentationReducer'
import rolesReducer from './rolesReducer'
import searchUserReducer from './searchUserReducer'
import statisticsReducer from './statisticsReducer'
import typesReducer from './typesReducer'
import uiReducer from './uiReducer'
import userReducer from './userReducer'

const allReducers = combineReducers({
  // name: state
  user: userReducer,
  UI: uiReducer,
  competitions: competitionsReducer,
  cities: citiesReducer,
  editor: editorReducer,
  presentation: presentationReducer,
  roles: rolesReducer,
  searchUsers: searchUserReducer,
  types: typesReducer,
  media: mediaReducer,
  statistics: statisticsReducer,
  competitionLogin: competitionLoginReducer,
})
export default allReducers
