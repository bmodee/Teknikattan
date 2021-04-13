import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Types from './types'
import { loginUser, logoutUser } from './user'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('dispatches correct actions when logging in user', async () => {
  const loginRes: any = {
    data: {
      access_token: 'TEST_ACCESS_TOKEN',
    },
  }
  const userDataRes: any = {
    data: {
      name: 'test_name',
    },
  }
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(loginRes)
  })
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(userDataRes)
  })
  const expectedActions = [
    { type: Types.LOADING_UI },
    { type: Types.LOADING_USER },
    { type: Types.CLEAR_ERRORS },
    { type: Types.SET_USER, payload: { name: 'test_name' } },
  ]
  const store = mockStore({})
  const history = createMemoryHistory()
  await loginUser({ email: 'test@email.com', password: 'testpassword' }, history)(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches correct action when logging out user', async () => {
  const store = mockStore({})
  await logoutUser()(store.dispatch)
  expect(store.getActions()).toEqual([{ type: Types.SET_UNAUTHENTICATED }])
})

it('dispatches correct action when failing to log in user', async () => {
  console.log = jest.fn()
  const errorMessage = 'getting teams failed'
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject({ response: { data: errorMessage } })
  })
  const store = mockStore({ competitions: { filterParams: [] } })
  const history = createMemoryHistory()
  const expectedActions = [{ type: Types.LOADING_UI }, { type: Types.SET_ERRORS, payload: errorMessage }]
  await loginUser({ email: 'test@email.com', password: 'testpassword' }, history)(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
  expect(console.log).toHaveBeenCalled()
})

it('dispatches correct actions when failing to get user data', async () => {
  console.log = jest.fn()
  const loginRes: any = {
    data: {
      access_token: 'TEST_ACCESS_TOKEN',
    },
  }
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(loginRes)
  })
  const errorMessage = 'getting teams failed'
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject({ response: { data: errorMessage } })
  })
  const store = mockStore({ competitions: { filterParams: [] } })
  const history = createMemoryHistory()
  const expectedActions = [{ type: Types.LOADING_UI }, { type: Types.LOADING_USER }, { type: Types.CLEAR_ERRORS }]
  await loginUser({ email: 'test@email.com', password: 'testpassword' }, history)(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
  expect(console.log).toHaveBeenCalled()
})
