/**
This file handles actions for the roles redux state
*/

import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

/** Get all roles and dispatch action to save them to roles state */
export const getRoles = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/api/misc/roles')
    .then((res) => {
      dispatch({
        type: Types.SET_ROLES,
        payload: res.data.items,
      })
    })
    .catch((err) => console.log(err))
}
