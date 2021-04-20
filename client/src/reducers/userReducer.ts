import { AnyAction } from 'redux'
import Types from '../actions/types'

interface UserInfo {
  name: string
  email: string
  role_id: number
  city_id: number
  id: number
}

interface UserState {
  authenticated: boolean
  userInfo: UserInfo | null
  loading: boolean
}

const initialState: UserState = {
  authenticated: false,
  loading: false,
  userInfo: null,
}

export default function (state = initialState, action: AnyAction) {
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
        userInfo: action.payload as UserInfo,
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
