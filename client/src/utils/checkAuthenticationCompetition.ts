import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { logoutCompetition } from '../actions/competitionLogin'
import { setPresentationCode } from '../actions/presentation'
import Types from '../actions/types'
import store from '../store'

const UnAuthorized = async () => {
  await logoutCompetition()(store.dispatch)
}

export const CheckAuthenticationCompetition = async () => {
  const authToken = localStorage.competitionToken
  if (authToken) {
    const decodedToken: any = jwtDecode(authToken)
    if (decodedToken.exp * 1000 >= Date.now()) {
      axios.defaults.headers.common['Authorization'] = authToken
      console.log(decodedToken.user_claims)
      await axios
        .get('/api/auth/test')
        .then((res) => {
          store.dispatch({ type: Types.SET_COMPETITION_LOGIN_AUTHENTICATED })
          store.dispatch({
            type: Types.SET_COMPETITION_LOGIN_DATA,
            payload: {
              competition_id: decodedToken.user_claims.competition_id,
              team_id: decodedToken.user_claims.team_id,
              view: res.data.view,
            },
          })
          setPresentationCode(decodedToken.user_claims.code)(store.dispatch)
        })
        .catch((error) => {
          console.log(error)
          UnAuthorized()
        })
    } else {
      await UnAuthorized()
    }
  }
}
