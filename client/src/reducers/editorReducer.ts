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
  activeSlideId: 0,
  loading: true,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_EDITOR_COMPETITION:
      return {
        competition: action.payload as RichCompetition,
        activeSlideId: action.payload.slides[0].id as number,
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
