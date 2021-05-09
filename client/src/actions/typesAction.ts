/**
This file handles actions for the types redux state
*/

import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

/** Get all types and save them to types state */
export const getTypes = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/api/misc/types')
    .then((res) => {
      dispatch({
        type: Types.SET_TYPES,
        payload: res.data,
      })
    })
    .catch((err) => console.log(err))
}
