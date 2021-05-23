/**
This file handles actions for the searchUser redux state
*/

import axios from 'axios'
import { UserFilterParams } from '../interfaces/FilterParams'
import { AppDispatch, RootState } from './../store'
import Types from './types'

/** Get all users using current filterParams in searchUser state */
export const getSearchUsers = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const currentParams: UserFilterParams = getState().searchUsers.filterParams
  // Send params in snake-case for api
  const params = {
    page_size: currentParams.pageSize,
    role_id: currentParams.roleId,
    city_id: currentParams.cityId,
    name: currentParams.name,
    page: currentParams.page,
    email: currentParams.email,
  }
  await axios
    .get('/api/users/search', { params })
    .then((res) => {
      dispatch({
        type: Types.SET_SEARCH_USERS,
        payload: res.data,
      })

      const pagination = JSON.parse(res.headers.pagination)
      dispatch({
        type: Types.SET_SEARCH_USERS_TOTAL_COUNT,
        payload: pagination.total,
      })
      dispatch({
        type: Types.SET_SEARCH_USERS_COUNT,
        payload: res.data.length,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

/** Set filterParams in searchUser state */
export const setFilterParams = (params: UserFilterParams) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_SEARCH_USERS_FILTER_PARAMS, payload: params })
}
