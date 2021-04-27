/*
This file handles actions for the presentation redux state
*/

import axios from 'axios'
import { Slide } from '../interfaces/ApiModels'
import { Timer } from '../interfaces/Timer'
import store, { AppDispatch } from './../store'
import Types from './types'

// Save competition in presentation state from input id
export const getPresentationCompetition = (id: string) => async (dispatch: AppDispatch) => {
  await axios
    .get(`/api/competitions/${id}`)
    .then((res) => {
      dispatch({
        type: Types.SET_PRESENTATION_COMPETITION,
        payload: res.data,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const setCurrentSlide = (slide: Slide) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_SLIDE, payload: slide })
}

export const setCurrentSlidePrevious = () => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_SLIDE_PREVIOUS })
}

export const setCurrentSlideNext = () => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_SLIDE_NEXT })
}

export const setCurrentSlideByOrder = (order: number) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_SLIDE_BY_ORDER, payload: order })
}

export const setPresentationCode = (code: string) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_CODE, payload: code })
}

export const setPresentationTimer = (timer: Timer) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_PRESENTATION_TIMER, payload: timer })
}

export const setPresentationTimerDecrement = () => (dispatch: AppDispatch) => {
  dispatch({
    type: Types.SET_PRESENTATION_TIMER,
    payload: {
      enabled: store.getState().presentation.timer.enabled,
      value: store.getState().presentation.timer.value - 1,
    },
  })
}
