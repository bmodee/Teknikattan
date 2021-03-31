//in userReducer.ts
import Types from '../actions/types'

const initialState = {
  authenticated: false,
  credentials: {},
  loading: false,
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case Types.SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      }
    case Types.SET_UNAUTHENTICATED:
      return initialState
    case Types.SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      }
    case Types.LOADING_USER:
      return {
        ...state,
        loading: true,
      }
    default:
      return state
  }
}
