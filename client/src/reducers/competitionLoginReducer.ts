import { AnyAction } from 'redux'
import Types from '../actions/types'

/** Define a type for the competition login data */
interface CompetitionLoginData {
  competition_id: number
  team_id: number | null
  view: string
}
/** Define a type for UI error */
interface UIError {
  message: string
}

/** Define a type for the competition login state */
interface CompetitionLoginState {
  loading: boolean
  errors: null | UIError
  authenticated: boolean
  data: CompetitionLoginData | null
  initialized: boolean
}

/** Define the initial values for the competition login state */
const initialState: CompetitionLoginState = {
  loading: false,
  errors: null,
  authenticated: false,
  data: null,
  initialized: false,
}

/** Intercept actions for competitionLogin state and update the state */
export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_COMPETITION_LOGIN_DATA:
      return {
        ...state,
        data: action.payload as CompetitionLoginData,
        authenticated: true,
        initialized: true,
      }
    case Types.SET_COMPETITION_LOGIN_ERRORS:
      return {
        ...state,
        errors: action.payload as UIError,
        loading: false,
      }
    case Types.CLEAR_COMPETITION_LOGIN_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      }
    case Types.LOADING_COMPETITION_LOGIN:
      return {
        ...state,
        loading: true,
      }
    default:
      return state
  }
}
