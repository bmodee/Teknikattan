import { AnyAction } from 'redux'
import Types from '../actions/types'
import { RichCompetition } from '../interfaces/ApiRichModels'

interface EditorState {
  competition: RichCompetition
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
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_EDITOR_COMPETITION:
      return {
        ...state,
        competition: action.payload as RichCompetition,
      }
    default:
      return state
  }
}
