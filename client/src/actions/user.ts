import axios from 'axios'
import Types from './types'

export const loginUser = (userData: any, history: any) => (dispatch: any) => {
  dispatch({ type: Types.LOADING_UI })
  axios
    .post('/auth/login', userData)
    .then((res) => {
      const token = `Bearer ${res.data.access_token}`
      localStorage.setItem('token', token) //setting token to local storage
      axios.defaults.headers.common['Authorization'] = token //setting authorize token to header in axios
      dispatch(getUserData())
      dispatch({ type: Types.CLEAR_ERRORS }) // no error
      history.push('/admin') //redirecting to admin page after login success
    })
    .catch((err) => {
      console.error(err)
      dispatch({
        type: Types.SET_ERRORS,
        payload: err.response.data,
      })
    })
}

export const getUserData = () => (dispatch: any) => {
  dispatch({ type: Types.LOADING_USER })
  axios
    .get('/users')
    .then((res) => {
      dispatch({
        type: Types.SET_USER,
        payload: res.data,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const logoutUser = () => (dispatch: any) => {
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
  dispatch({
    type: Types.SET_UNAUTHENTICATED,
  })
  window.location.href = '/' //redirect to login page
}
