import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { loginCompetition, logoutCompetition } from './competitionLogin'
import Types from './types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('dispatches correct actions when logging into competition', async () => {
  const compRes: any = {
    data: {
      id: 5,
      slides: [],
    },
  }
  const compLoginDataRes: any = {
    data: {
      access_token: 'TEST_ACCESS_TOKEN',
      competition_id: 'test_name',
      team_id: 'test_team',
      view: 'test_view',
    },
  }
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.resolve(compLoginDataRes)
  })
  ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
    return Promise.resolve(compRes)
  })
  const expectedActions = [
    { type: Types.LOADING_COMPETITION_LOGIN },
    { type: Types.CLEAR_COMPETITION_LOGIN_ERRORS },
    {
      type: Types.SET_COMPETITION_LOGIN_DATA,
      payload: {
        competition_id: compLoginDataRes.data.competition_id,
        team_id: compLoginDataRes.data.team_id,
        view: compLoginDataRes.data.view,
      },
    },
    { type: Types.SET_PRESENTATION_COMPETITION, payload: compRes.data },
  ]
  const store = mockStore({})
  const history = createMemoryHistory()
  await loginCompetition('code', history, true)(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches correct action when logging out from competition', async () => {
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.resolve({ data: {} })
  })
  const store = mockStore({})
  await logoutCompetition('Judge')(store.dispatch)
  expect(store.getActions()).toEqual([{ type: Types.SET_COMPETITION_LOGIN_UNAUTHENTICATED }])
})

it('dispatches correct action when failing to log in user', async () => {
  console.log = jest.fn()
  const errorMessage = 'getting teams failed'
  ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
    return Promise.reject({ response: { data: { message: errorMessage } } })
  })
  const store = mockStore({})
  const history = createMemoryHistory()
  const expectedActions = [
    { type: Types.LOADING_COMPETITION_LOGIN },
    { type: Types.SET_COMPETITION_LOGIN_ERRORS, payload: errorMessage },
  ]
  await loginCompetition('code', history, true)(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual(expectedActions)
  expect(console.log).toHaveBeenCalled()
})
