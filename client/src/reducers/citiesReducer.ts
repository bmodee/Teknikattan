import { AnyAction } from 'redux'
import Types from '../actions/types'
import { City } from '../interfaces/ApiModels'

/** Define a type for the city state */
interface CityState {
  cities: City[]
  total: number
  count: number
}

/** Define initial values for the city state */
const initialState: CityState = {
  cities: [],
  total: 0,
  count: 0,
}

/** Intercept actions for cities state and update the state */
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
