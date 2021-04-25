/*
This file handles actions for the competitions redux state
*/

import axios from 'axios'
import { CompetitionFilterParams } from '../interfaces/FilterParams'
import { AppDispatch, RootState } from './../store'
import Types from './types'

// Get all competitions using filterParams from current state
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

// Dispatch action to set filter params
export const setFilterParams = (params: CompetitionFilterParams) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_COMPETITIONS_FILTER_PARAMS, payload: params })
}
