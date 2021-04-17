import { AnyAction } from 'redux'
import Types from '../actions/types'
import { ComponentType, MediaType, QuestionType, ViewType } from '../interfaces/ApiModels'

interface TypesState {
  componentTypes: ComponentType[]
  viewTypes: ViewType[]
  questionTypes: QuestionType[]
  mediaTypes: MediaType[]
}
const initialState: TypesState = {
  componentTypes: [],
  viewTypes: [],
  questionTypes: [],
  mediaTypes: [],
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_TYPES:
      state.componentTypes = action.payload.component_types as ComponentType[]
      state.viewTypes = action.payload.view_types as ViewType[]
      state.questionTypes = action.payload.question_types as QuestionType[]
      state.mediaTypes = action.payload.media_types as MediaType[]
      return state
    default:
      return state
  }
}
