/** This file contains the funtion to check if Admin is authenticated */

import axios from 'axios'
import jwtDecode from 'jwt-decode'
import Types from '../actions/types'
import { logoutUser } from '../actions/user'
import store from '../store'

/** The user is not authorized => logout the user*/
const UnAuthorized = async () => {
  await logoutUser()(store.dispatch)
}

export const CheckAuthenticationAdmin = async () => {
  const authToken = localStorage.token // Retrives from local storage
  if (authToken) {
    // If the user has an authtoken
    const decodedToken: any = jwtDecode(authToken) // Decode it
    if (decodedToken.exp * 1000 >= Date.now()) {
      // Check expiration data anb if it is still valid
      axios.defaults.headers.common['Authorization'] = authToken
      store.dispatch({ type: Types.LOADING_USER })
      await axios
        .get('/api/users')
        .then((res) => {
          store.dispatch({ type: Types.SET_AUTHENTICATED }) // Make user authenticated
          store.dispatch({
            type: Types.SET_USER,
            payload: res.data,
          })
        })
        .catch((error) => {
          // An error has occured
          console.log(error) // Log the error
          UnAuthorized() // The user is not authorized
        })
    } else {
      await UnAuthorized() // The user is not authorized
    }
  }
}
