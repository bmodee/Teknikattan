import { AnyAction } from 'redux'
import Types from '../actions/types'

// Define a type for the UI error
interface UIError {
  message: string
}

// Define a type for the UI state
interface UIState {
  loading: boolean
  errors: null | UIError
}

// Define the initial values for the UI state
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
