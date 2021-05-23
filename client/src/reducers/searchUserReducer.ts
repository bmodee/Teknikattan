import { AnyAction } from 'redux'
import Types from '../actions/types'
import { User } from '../interfaces/ApiModels'
import { UserFilterParams } from '../interfaces/FilterParams'

/** Define a type for the search user state */
interface SearchUserState {
  users: User[]
  total: number
  count: number
  filterParams: UserFilterParams
}

/** Define the initial values for the search user state */
const initialState: SearchUserState = {
  users: [],
  total: 0,
  count: 0,
  filterParams: { pageSize: 10, page: 1 },
}

/** Intercept actions for searchUser state and update the state */
export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_SEARCH_USERS:
      return {
        ...state,
        users: action.payload as User[],
      }
    case Types.SET_SEARCH_USERS_FILTER_PARAMS:
      return {
        ...state,
        filterParams: action.payload as UserFilterParams,
      }
    case Types.SET_SEARCH_USERS_TOTAL_COUNT:
      return {
        ...state,
        total: action.payload as number,
      }
    case Types.SET_SEARCH_USERS_COUNT:
      return {
        ...state,
        count: action.payload as number,
      }
    default:
      return state
  }
}
