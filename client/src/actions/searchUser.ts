import axios from 'axios'
import { UserFilterParams } from '../interfaces/UserData'
import { AppDispatch, RootState } from './../store'
import Types from './types'

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
    .get('/users/search', { params })
    .then((res) => {
      dispatch({
        type: Types.SET_SEARCH_USERS,
        payload: res.data.items,
      })
      dispatch({
        type: Types.SET_SEARCH_USERS_TOTAL_COUNT,
        payload: res.data.total_count,
      })
      dispatch({
        type: Types.SET_SEARCH_USERS_COUNT,
        payload: res.data.count,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
export const setFilterParams = (params: UserFilterParams) => (dispatch: AppDispatch) => {
  dispatch({ type: Types.SET_SEARCH_USERS_FILTER_PARAMS, payload: params })
}
