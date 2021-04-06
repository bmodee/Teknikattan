import axios from 'axios'
import jwtDecode from 'jwt-decode'
import Types from '../actions/types'
import { logoutUser } from '../actions/user'
import store from '../store'

const UnAuthorized = () => {
  logoutUser()(store.dispatch)
}

export const CheckAuthentication = async () => {
  const authToken = localStorage.token
  if (authToken) {
    const decodedToken: any = jwtDecode(authToken)
    if (decodedToken.exp * 1000 >= Date.now()) {
      axios.defaults.headers.common['Authorization'] = authToken
      store.dispatch({ type: Types.LOADING_USER })
      console.log('loading user')
      await axios
        .get('/users')
        .then((res) => {
          store.dispatch({ type: Types.SET_AUTHENTICATED })
          store.dispatch({
            type: Types.SET_USER,
            payload: res.data,
          })
        })
        .catch((error) => {
          console.error(error)
          UnAuthorized()
        })
    } else {
      UnAuthorized()
    }
  }
}
