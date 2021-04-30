import { AnyAction } from 'redux'
import Types from '../actions/types'

interface CompetitionLoginData {
  competition_id: number
  team_id: number | null
  view: string
}

interface UIError {
  message: string
}

interface CompetitionLoginState {
  loading: boolean
  errors: null | UIError
  authenticated: boolean
  data: CompetitionLoginData | null
  initialized: boolean
}

const initialState: CompetitionLoginState = {
  loading: false,
  errors: null,
  authenticated: false,
  data: null,
  initialized: false,
}

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
