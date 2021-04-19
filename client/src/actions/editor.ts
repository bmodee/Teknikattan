import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

export const getEditorCompetition = (id: string) => async (dispatch: AppDispatch) => {
  await axios
    .get(`/competitions/${id}`)
    .then((res) => {
      dispatch({
        type: Types.SET_EDITOR_COMPETITION,
        payload: res.data,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const setEditorSlideId = (id: number) => (dispatch: AppDispatch) => {
  dispatch({
    type: Types.SET_EDITOR_SLIDE_ID,
    payload: id,
  })
}
