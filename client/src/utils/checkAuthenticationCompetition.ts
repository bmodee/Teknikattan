import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { logoutCompetition } from '../actions/competitionLogin'
import { getPresentationCompetition, setPresentationCode } from '../actions/presentation'
import Types from '../actions/types'
import store from '../store'

const UnAuthorized = async (role: 'Judge' | 'Operator' | 'Team' | 'Audience') => {
  await logoutCompetition(role)(store.dispatch)
}

export const CheckAuthenticationCompetition = async (role: 'Judge' | 'Operator' | 'Team' | 'Audience') => {
  const authToken = localStorage[`${role}Token`]
  if (authToken) {
    const decodedToken: any = jwtDecode(authToken)
    if (decodedToken.exp * 1000 >= Date.now()) {
      axios.defaults.headers.common['Authorization'] = authToken
      await axios
        .get('/api/auth/test')
        .then(() => {
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
          console.log(error)
          UnAuthorized(role)
        })
    } else {
      await UnAuthorized(role)
    }
  }
}
