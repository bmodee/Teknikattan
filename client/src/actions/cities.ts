import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

export const getCities = () => async (dispatch: AppDispatch) => {
  await axios
    .get('/misc/cities')
    .then((res) => {
      dispatch({
        type: Types.SET_CITIES,
        payload: res.data.items,
      })
      dispatch({
        type: Types.SET_CITIES_COUNT,
        payload: res.data.total_count,
      })
      dispatch({
        type: Types.SET_CITIES_TOTAL,
        payload: res.data.count,
      })
    })
    .catch((err) => console.log(err))
}
