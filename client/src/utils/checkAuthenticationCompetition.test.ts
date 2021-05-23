import mockedAxios from 'axios'
import Types from '../actions/types'
import store from '../store'
import { CheckAuthenticationCompetition } from './checkAuthenticationCompetition'

it('dispatches correct actions when auth token is ok', async () => {
  const compRes = { data: { id: 3, slides: [{ id: 2 }] } }
  ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
    return Promise.resolve(compRes)
  })
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.resolve({ data: {} })
  })
  const spy = jest.spyOn(store, 'dispatch')
  const decodedToken = {
    iat: 1620216181,
    exp: 32514436993,
    competition_id: 123123,
    team_id: 321321,
    view: 'Participant',
    code: 'ABCDEF',
  }

  const testToken =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjAyMTYxODEsImV4cCI6MzI1MTQ0MzY5OTMsImNvbXBldGl0aW9uX2lkIjoxMjMxMjMsInRlYW1faWQiOjMyMTMyMSwidmlldyI6IlBhcnRpY2lwYW50IiwiY29kZSI6IkFCQ0RFRiJ9.fNrU8s-ZHPFCLYqtD2nogmSy31sBtX-8KWu911xNC8I'
  localStorage.setItem('JudgeToken', testToken)
  await CheckAuthenticationCompetition('Judge')
  expect(spy).toBeCalledWith({
    type: Types.SET_COMPETITION_LOGIN_DATA,
    payload: {
      competition_id: decodedToken.competition_id,
      team_id: decodedToken.team_id,
      view: decodedToken.view,
    },
  })
  expect(spy).toBeCalledWith({ type: Types.SET_PRESENTATION_CODE, payload: decodedToken.code })
  expect(spy).toBeCalledWith({
    type: Types.SET_PRESENTATION_COMPETITION,
    payload: compRes.data,
  })
  expect(spy).toBeCalledTimes(4)
})

it('dispatches correct actions when getting user data fails', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
    return Promise.reject(new Error('failed getting user data'))
  })
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.resolve({ data: {} })
  })
  const spy = jest.spyOn(store, 'dispatch')
  const testToken =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjAyMTYxODEsImV4cCI6MzI1MTQ0MzY5OTMsImNvbXBldGl0aW9uX2lkIjoxMjMxMjMsInRlYW1faWQiOjMyMTMyMSwidmlldyI6IlBhcnRpY2lwYW50IiwiY29kZSI6IkFCQ0RFRiJ9.fNrU8s-ZHPFCLYqtD2nogmSy31sBtX-8KWu911xNC8I'
  localStorage.setItem('AudienceToken', testToken)
  await CheckAuthenticationCompetition('Audience')
  expect(spy).toBeCalledWith({ type: Types.SET_COMPETITION_LOGIN_UNAUTHENTICATED })
  expect(spy).toBeCalledTimes(1)
  expect(console.log).toHaveBeenCalled()
})

it('dispatches no actions when no token exists', async () => {
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.resolve({ data: {} })
  })
  const spy = jest.spyOn(store, 'dispatch')
  await CheckAuthenticationCompetition('Operator')
  expect(spy).not.toBeCalled()
})

it('dispatches correct actions when token is expired', async () => {
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.resolve({ data: {} })
  })
  const testToken =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MjAyMjE1OTgsImV4cCI6OTU3NTMzNTk4LCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJqcm9ja2V0QGV4YW1wbGUuY29tIn0.uFXtkAsf-cTlKrTIdZ3E-gXnHkzS08iPrhS8iNCGV2E'
  localStorage.setItem('TeamToken', testToken)
  const spy = jest.spyOn(store, 'dispatch')
  await CheckAuthenticationCompetition('Team')
  expect(spy).toBeCalledWith({ type: Types.SET_COMPETITION_LOGIN_UNAUTHENTICATED })
  expect(spy).toBeCalledTimes(1)
})
