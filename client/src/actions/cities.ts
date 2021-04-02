import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

export const getCities = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/misc/cities')
    .then((res) => {
      dispatch({
        type: Types.SET_CITIES,
        payload: res.data,
      })
    })
    .catch((err) => console.log(err))
}
