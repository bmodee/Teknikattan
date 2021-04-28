import { AnyAction } from 'redux'
import Types from '../actions/types'
import { Slide, Team } from '../interfaces/ApiModels'
import { Timer } from '../interfaces/Timer'
import { RichCompetition } from './../interfaces/ApiRichModels'

interface PresentationState {
  competition: RichCompetition
  slide: Slide
  code: string
  timer: Timer
}

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
  slide: {
    competition_id: 0,
    id: -1,
    order: 0,
    timer: 0,
    title: '',
    background_image: undefined,
  },
  code: '',
  timer: {
    enabled: false,
    value: 0,
  },
}

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
    case Types.SET_PRESENTATION_SLIDE:
      return {
        ...state,
        slide: action.payload as Slide,
      }
    case Types.SET_PRESENTATION_SLIDE_PREVIOUS:
      if (state.slide.order - 1 >= 0) {
        return {
          ...state,
          slide: state.competition.slides[state.slide.order - 1],
        }
      }
      return state
    case Types.SET_PRESENTATION_SLIDE_NEXT:
      if (state.slide.order + 1 < state.competition.slides.length) {
        return {
          ...state,
          slide: state.competition.slides[state.slide.order + 1],
        }
      }
      return state
    case Types.SET_PRESENTATION_SLIDE_BY_ORDER:
      if (0 <= action.payload && action.payload < state.competition.slides.length)
        return {
          ...state,
          slide: state.competition.slides[action.payload],
        }
      return state
    case Types.SET_PRESENTATION_TIMER:
      if (action.payload.value == 0) {
        action.payload.enabled = false
      }
      return {
        ...state,
        timer: action.payload,
      }
    default:
      return state
  }
}
