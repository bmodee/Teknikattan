import { AnyAction } from 'redux'
import Types from '../actions/types'

interface StatisticsState {
  users: number
  competitions: number
  regions: number
}

const initialState: StatisticsState = {
  users: 0,
  competitions: 0,
  regions: 0,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_STATISTICS:
      state = action.payload as StatisticsState
      return state
    default:
      return state
  }
}