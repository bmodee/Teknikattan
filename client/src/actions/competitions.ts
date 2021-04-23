import axios from 'axios'
import { CompetitionFilterParams } from '../interfaces/FilterParams'
import { AppDispatch, RootState } from './../store'
import Types from './types'

export const getCompetitions = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const currentParams: CompetitionFilterParams = getState().competitions.filterParams
  // Send params in snake-case for api
  const params = {
    page_size: currentParams.pageSize,
    style_id: currentParams.styleId,
    city_id: currentParams.cityId,
    name: currentParams.name,
    page: currentParams.page,
    year: currentParams.year,
  }
  await axios
    .get('/api/competitions/search', { params })
    .then((res) => {
      dispatch({
        type: Types.SET_COMPETITIONS,
        payload: res.data.items,
      })
      dispatch({
        type: Types.SET_COMPETITIONS_TOTAL,
        payload: res.data.total_count,
      })
      dispatch({
        type: Types.SET_COMPETITIONS_COUNT,
        payload: res.data.count,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
export const setFilterParams = (params: CompetitionFilterParams) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_COMPETITIONS_FILTER_PARAMS, payload: params })
}
