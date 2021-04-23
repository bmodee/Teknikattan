import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

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
