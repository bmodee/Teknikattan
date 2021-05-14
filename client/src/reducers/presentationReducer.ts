import { AnyAction } from 'redux'
import Types from '../actions/types'
import { Timer } from '../interfaces/Timer'
import { RichCompetition } from './../interfaces/ApiRichModels'

/** Define a type for the presentation state */
interface PresentationState {
  competition: RichCompetition
  activeSlideId: number
  code: string
  timer: Timer
}

/** Define the initial values for the presentation state */
const initialState: PresentationState = {
  competition: {
    name: '',
    id: 1,
    city_id: 0,
    slides: [],
    year: 0,
    teams: [],
    background_image: undefined,
  },
  activeSlideId: -1,
  code: '',
  timer: {
    enabled: false,
    value: 0,
  },
}

/** Intercept actions for presentation state and update the state */
export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_PRESENTATION_COMPETITION:
      return {
        ...state,
        competition: action.payload as RichCompetition,
      }
    case Types.SET_PRESENTATION_CODE:
      return {
        ...state,
        code: action.payload,
      }
    case Types.SET_PRESENTATION_SLIDE_ID:
      return {
        ...state,
        activeSlideId: action.payload as number,
      }
    case Types.SET_PRESENTATION_TIMER:
      const timer = action.payload as Timer
      if (action.payload.value == 0) {
        timer.enabled = false
      }
      return {
        ...state,
        timer,
      }
    default:
      return state
  }
}
