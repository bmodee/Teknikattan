/*
This file handles actions for the editor redux state
*/

import axios from 'axios'
import { AppDispatch, RootState } from './../store'
import Types from './types'

// Save competition in editor state from input id
export const getEditorCompetition = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  await axios
    .get(`/api/competitions/${id}`)
    .then((res) => {
      dispatch({
        type: Types.SET_EDITOR_COMPETITION,
        payload: res.data,
      })
      if (getState().editor.activeSlideId === -1 && res.data.slides[0]) {
        setEditorSlideId(res.data.slides[0].id)(dispatch)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

// Set currentSlideId in editor state
export const setEditorSlideId = (id: number) => (dispatch: AppDispatch) => {
  dispatch({
    type: Types.SET_EDITOR_SLIDE_ID,
    payload: id,
  })
}
