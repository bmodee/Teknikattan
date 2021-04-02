import { AnyAction } from 'redux'
import Types from '../actions/types'
import { City } from '../interfaces/City'

const initialState: City[] = []

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_CITIES:
      return action.payload as City[]
    default:
      return state
  }
}
