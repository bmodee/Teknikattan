/*
This file handles actions for the competitionLogin redux state
*/

import axios from 'axios'
import { History } from 'history'
import { AppDispatch } from '../store'
import { AccountLoginModel } from './../interfaces/FormModels'
import Types from './types'

// Action creator to attempt to login with competition code
export const loginCompetition = (code: string, history: History) => async (dispatch: AppDispatch) => {
  dispatch({ type: Types.LOADING_COMPETITION_LOGIN })
  await axios
    .post('/api/auth/login/code', { code })
    .then((res) => {
      console.log(code, res.data[0])
      dispatch({ type: Types.CLEAR_COMPETITION_LOGIN_ERRORS }) // no error
      // history.push('/admin') //redirecting to admin page after login success
      if (res.data && res.data[0] && res.data[0].view_type_id) {
        history.push(`/${code}`)
      }
    })
    .catch((err) => {
      dispatch({ type: Types.SET_COMPETITION_LOGIN_ERRORS, payload: err && err.response && err.response.data })
      console.log(err)
    })
}
