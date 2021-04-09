import { AnyAction } from 'redux'
import Types from '../actions/types'
import { RichCompetition } from './../interfaces/ApiRichModels'
import { Slide } from './../interfaces/Slide'
import { Team } from './../interfaces/Team'

interface PresentationState {
  competition: RichCompetition
  slide: Slide
  teams: Team[]
}

const initialState: PresentationState = {
  competition: {
    name: '',
    id: 0,
    city: {
      id: 0,
      name: '',
    },
    slides: [],
    year: 0,
    teams: [],
  },
  slide: {
    competition_id: 0,
    id: 0,
    order: 0,
    timer: 0,
    title: '',
  },
  teams: [],
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_PRESENTATION_COMPETITION:
      return {
        ...state,
        slide: action.payload.slides[0] as Slide,
        competition: action.payload as RichCompetition,
      }
    case Types.SET_PRESENTATION_TEAMS:
      return {
        ...state,
        teams: action.payload as Team[],
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
    default:
      return state
  }
}
