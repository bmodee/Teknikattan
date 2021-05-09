/**
This file handles actions for the user redux state
*/

import axios from 'axios'
import { History } from 'history'
import { AppDispatch } from '../store'
import { AccountLoginModel } from './../interfaces/FormModels'
import Types from './types'

/** Attempt to log in user, dispatch correct actions and save jwt token to localStorage and axios auth header */
export const loginUser = (userData: AccountLoginModel, history: History) => async (dispatch: AppDispatch) => {
  dispatch({ type: Types.LOADING_UI })
  await axios
    .post('/api/auth/login', userData)
    .then((res) => {
      const token = `Bearer ${res.data.access_token}`
      localStorage.setItem('token', token) //setting token to local storage
      axios.defaults.headers.common['Authorization'] = token //setting authorize token to header in axios
      getUserData()(dispatch)
      dispatch({ type: Types.CLEAR_ERRORS }) // no error
      history.push('/admin') //redirecting to admin page after login success
    })
    .catch((err) => {
      console.log(err)
      dispatch({
        type: Types.SET_ERRORS,
        payload: err && err.response && err.response.data,
      })
    })
}

/** Get data for user and save to user state */
export const getUserData = () => async (dispatch: AppDispatch) => {
  dispatch({ type: Types.LOADING_USER })
  await axios
    .get('/api/users')
    .then((res) => {
      dispatch({
        type: Types.SET_USER,
        payload: res.data,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

/** Log out user and remove jwt token from local storage and axios */
export const logoutUser = () => async (dispatch: AppDispatch) => {
  localStorage.removeItem('token')
  await axios.post('/api/auth/logout').then(() => {
    delete axios.defaults.headers.common['Authorization']
    dispatch({
      type: Types.SET_UNAUTHENTICATED,
    })
    window.location.href = '/' //redirect to login page
  })
}
