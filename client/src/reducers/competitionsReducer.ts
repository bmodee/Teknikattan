import { AnyAction } from 'redux'
import Types from '../actions/types'
import { Competition } from '../interfaces/ApiModels'
import { CompetitionFilterParams } from './../interfaces/FilterParams'

/** Define a type for competitions state */
interface CompetitionState {
  competitions: Competition[]
  total: number
  count: number
  filterParams: CompetitionFilterParams
}

/** Define the initial values for the competition state */
const initialState: CompetitionState = {
  competitions: [],
  total: 0,
  count: 0,
  filterParams: { pageSize: 10, page: 0 },
}

/** Intercept actions for competitions state and update the state */
export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_COMPETITIONS:
      return {
        ...state,
        competitions: action.payload as Competition[],
      }
    case Types.SET_COMPETITIONS_FILTER_PARAMS:
      return {
        ...state,
        filterParams: action.payload as CompetitionFilterParams,
      }
    case Types.SET_COMPETITIONS_TOTAL:
      return {
        ...state,
        total: action.payload as number,
      }
    case Types.SET_COMPETITIONS_COUNT:
      return {
        ...state,
        count: action.payload as number,
      }
    default:
      return state
  }
}
