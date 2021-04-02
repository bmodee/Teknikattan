import { AnyAction } from 'redux'
import Types from '../actions/types'

interface UIError {
  message: string
}

interface UIState {
  loading: boolean
  errors: null | UIError
}

const initialState: UIState = {
  loading: false,
  errors: null,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload as UIError,
      }
    case Types.CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      }
    case Types.LOADING_UI:
      return {
        ...state,
        loading: true,
      }
    default:
      return state
  }
}
