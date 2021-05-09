/**
This file handles actions for the competitionLogin redux state
*/

import axios from 'axios'
import { History } from 'history'
import { AppDispatch, RootState } from '../store'
import { getPresentationCompetition } from './presentation'
import Types from './types'

/** Action creator to attempt to login with competition code */
export const loginCompetition = (code: string, history: History, redirect: boolean) => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  dispatch({ type: Types.LOADING_COMPETITION_LOGIN })
  await axios
    .post('/api/auth/login/code', { code })
    .then((res) => {
      const token = `Bearer ${res.data.access_token}`
      localStorage.setItem('competitionToken', token) //setting token to local storage
      axios.defaults.headers.common['Authorization'] = token //setting authorize token to header in axios
      dispatch({ type: Types.CLEAR_COMPETITION_LOGIN_ERRORS }) // no error
      dispatch({
        type: Types.SET_COMPETITION_LOGIN_DATA,
        payload: {
          competition_id: res.data.competition_id,
          team_id: res.data.team_id,
          view: res.data.view,
        },
      })
      getPresentationCompetition(res.data.competition_id)(dispatch, getState)
      if (redirect && res.data && res.data.view) {
        history.push(`/${code}`)
      }
    })
    .catch((err) => {
      dispatch({ type: Types.SET_COMPETITION_LOGIN_ERRORS, payload: err && err.response && err.response.data })
      console.log(err)
    })
}

// Log out from competition and remove jwt token from local storage and axios
export const logoutCompetition = () => async (dispatch: AppDispatch) => {
  localStorage.removeItem('competitionToken')
  await axios.post('/api/auth/logout').then(() => {
    delete axios.defaults.headers.common['Authorization']
    dispatch({
      type: Types.SET_COMPETITION_LOGIN_UNAUTHENTICATED,
    })
    window.location.href = '/' //redirect to login page
  })
}
