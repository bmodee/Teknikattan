import { AnyAction } from 'redux'
import Types from '../actions/types'
import { City } from '../interfaces/City'

interface CityState {
  cities: City[]
  total: number
  count: number
}
const initialState: CityState = {
  cities: [],
  total: 0,
  count: 0,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_CITIES:
      return { ...state, cities: action.payload as City[] }
    case Types.SET_CITIES_TOTAL:
      return {
        ...state,
        total: action.payload as number,
      }
    case Types.SET_CITIES_COUNT:
      return {
        ...state,
        count: action.payload as number,
      }
    default:
      return state
  }
}
