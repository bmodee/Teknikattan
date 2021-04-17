import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

export const getTypes = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/misc/types')
    .then((res) => {
      dispatch({
        type: Types.SET_TYPES,
        payload: res.data,
      })
    })
    .catch((err) => console.log(err))
}
