import { AnyAction } from 'redux'
import Types from '../actions/types'
import { Role } from '../interfaces/ApiModels'

/** Define a type for the role state */
interface RoleState {
  roles: Role[]
}

/** Define the initial values for the role state */
const initialState: RoleState = {
  roles: [],
}

/** Intercept actions for roles state and update the state */
export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_ROLES:
      return { ...state, roles: action.payload as Role[] }
    default:
      return state
  }
}
