/**
This file handles actions for the presentation redux state
*/

import axios from 'axios'
import { Timer } from '../interfaces/Timer'
import store, { AppDispatch, RootState } from './../store'
import Types from './types'

/** Save competition in presentation state from input id */
export const getPresentationCompetition = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  await axios
    .get(`/api/competitions/${id}`)
    .then((res) => {
      dispatch({
        type: Types.SET_PRESENTATION_COMPETITION,
        payload: res.data,
      })
      if (getState().presentation?.activeSlideId === -1 && res.data?.slides[0]) {
        setCurrentSlideByOrder(0)(dispatch, getState)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

/** Set presentation slide using input order */
export const setCurrentSlideByOrder = (order: number) => (dispatch: AppDispatch, getState: () => RootState) => {
  const slideId = getState().presentation.competition.slides.find((slide) => slide.order === order)?.id
  dispatch({ type: Types.SET_PRESENTATION_SLIDE_ID, payload: slideId })
}

/** Set code of presentation */
export const setPresentationCode = (code: string) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_CODE, payload: code })
}
/** Set timer to input value */
export const setPresentationTimer = (timer: Timer) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_TIMER, payload: timer })
}

/** Decrement timer */
export const setPresentationTimerDecrement = () => (dispatch: AppDispatch) => {
  dispatch({
    type: Types.SET_PRESENTATION_TIMER,
    payload: {
      enabled: store.getState().presentation.timer.enabled,
      value: store.getState().presentation.timer.value - 1,
    },
  })
}
