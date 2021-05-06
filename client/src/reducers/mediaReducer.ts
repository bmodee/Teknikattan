import { AnyAction } from 'redux'
import Types from '../actions/types'

interface MediaState {
  id: number
  filename: string
  mediatype_id: number
  user_id: number
}

// Define the initial values for the media state
const initialState: MediaState = {
  id: 0,
  filename: '',
  mediatype_id: 1,
  user_id: 0,
}

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case Types.SET_MEDIA_ID:
      return { ...state, id: action.payload as number }
    case Types.SET_MEDIA_FILENAME:
      return {
        ...state,
        filename: action.payload as string,
      }
    case Types.SET_MEDIA_TYPE_ID:
      return {
        ...state,
        mediatype_id: action.payload as number,
      }
    case Types.SET_MEDIA_USER_ID:
      return {
        ...state,
        user_id: action.payload as number,
      }
    default:
      return state
  }
}
