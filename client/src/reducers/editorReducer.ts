import { AnyAction } from 'redux'
import Types from '../actions/types'
import { RichCompetition } from '../interfaces/ApiRichModels'

interface EditorState {
  competition: RichCompetition
  activeSlideId: number
  loading: boolean
}

const initialState: EditorState = {
  competition: {
    name: '',
    id: 0,
    year: 0,
    city_id: 1,
    slides: [],
    teams: [],
  },
  activeSlideId: -1,
  loading: true,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_EDITOR_COMPETITION:
      return {
        ...state,
        competition: action.payload as RichCompetition,
        loading: false,
      }
    case Types.SET_EDITOR_SLIDE_ID:
      return {
        ...state,
        activeSlideId: action.payload as number,
      }
    default:
      return state
  }
}