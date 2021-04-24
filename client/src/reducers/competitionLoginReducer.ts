import { AnyAction } from 'redux'
import Types from '../actions/types'

interface UIError {
  message: string
}

interface UserState {
  loading: boolean
  errors: null | UIError
}

const initialState: UserState = {
  loading: false,
  errors: null,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_COMPETITION_LOGIN_ERRORS:
      return {
        errors: action.payload as UIError,
        loading: false,
      }
    case Types.CLEAR_COMPETITION_LOGIN_ERRORS:
      return {
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
