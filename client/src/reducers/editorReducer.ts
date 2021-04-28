import { AnyAction } from 'redux'
import Types from '../actions/types'
import { RichCompetition } from '../interfaces/ApiRichModels'

interface EditorState {
  competition: RichCompetition
  activeSlideId: number
  activeViewTypeId: number
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
    background_image: undefined,
  },
  activeSlideId: -1,
  activeViewTypeId: -1,
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
    case Types.SET_EDITOR_VIEW_ID:
      return {
        ...state,
        activeViewTypeId: action.payload as number,
      }
    default:
      return state
  }
}
