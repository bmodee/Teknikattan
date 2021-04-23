import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

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
