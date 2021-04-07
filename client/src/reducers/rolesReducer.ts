import { AnyAction } from 'redux'
import Types from '../actions/types'
import { Role } from '../interfaces/Role'

interface RoleState {
  roles: Role[]
}
const initialState: RoleState = {
  roles: [],
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_ROLES:
      return { ...state, roles: action.payload as Role[] }
    default:
      return state
  }
}
