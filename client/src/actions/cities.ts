/**
This file handles actions for the cities redux state
*/

import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

/**  Action creator to get all cities from api and send appropriate actions to reducer */
export const getCities = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/api/misc/cities')
    .then((res) => {
      dispatch({
        type: Types.SET_CITIES,
        payload: res.data,
      })
      dispatch({
        type: Types.SET_CITIES_TOTAL,
        payload: res.data.length,
      })
      dispatch({
        type: Types.SET_CITIES_COUNT,
        payload: res.data.length,
      })
    })
    .catch((err) => console.log(err))
}
