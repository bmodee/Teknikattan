/** This file contains the funtion to check if authenticated
 *  when logging in with a code generated from competition
 */

import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { logoutCompetition } from '../actions/competitionLogin'
import { getPresentationCompetition, setPresentationCode } from '../actions/presentation'
import Types from '../actions/types'
import store from '../store'

/** The user is not authorized => logout the user*/
const UnAuthorized = async (role: 'Judge' | 'Operator' | 'Team' | 'Audience') => {
  await logoutCompetition(role)(store.dispatch)
}

export const CheckAuthenticationCompetition = async (role: 'Judge' | 'Operator' | 'Team' | 'Audience') => {
  const authToken = localStorage[`${role}Token`] // Retrives from local storage
  if (authToken) {
    // If the user has an authtoken
    const decodedToken: any = jwtDecode(authToken) // Decode it
    // Check expiration data anb if it is still valid
    if (decodedToken.exp * 1000 >= Date.now()) {
      axios.defaults.headers.common['Authorization'] = authToken
      await axios
        .get('/api/auth/test')
        .then(() => {
          // Make user authenticated
          store.dispatch({
            type: Types.SET_COMPETITION_LOGIN_DATA,
            payload: {
              competition_id: decodedToken.competition_id,
              team_id: decodedToken.team_id,
              view: decodedToken.view,
            },
          })
          getPresentationCompetition(decodedToken.competition_id)(store.dispatch, store.getState)
          setPresentationCode(decodedToken.code)(store.dispatch)
        })
        .catch((error) => {
          // An error has occured
          console.log(error) // Log the error
          UnAuthorized(role) // The user is not authorized
        })
    } else {
      await UnAuthorized(role) // The user is not authorized
    }
  }
}
