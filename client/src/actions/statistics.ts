/*
This file handles actions for the statistics redux state
*/

import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

// Get all statistics and dispatch actions to save them to statistics state
export const getStatistics = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/api/misc/statistics')
    .then((res) => {
      dispatch({
        type: Types.SET_STATISTICS,
        payload: res.data,
      })
    })
    .catch((err) => console.log(err))
}
