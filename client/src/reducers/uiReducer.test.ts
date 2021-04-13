import Types from '../actions/types'
import userReducer from './userReducer'

const initialState = {
  authenticated: false,
  loading: false,
  userInfo: null,
}

it('should return the initial state', () => {
  expect(userReducer(undefined, {} as any)).toEqual(initialState)
})

it('should handle SET_AUTHENTICATED', () => {
  expect(
    userReducer(initialState, {
      type: Types.SET_AUTHENTICATED,
    })
  ).toEqual({
    authenticated: true,
    loading: initialState.loading,
    userInfo: initialState.userInfo,
  })
})

it('should handle SET_UNAUTHENTICATED', () => {
  expect(
    userReducer(initialState, {
      type: Types.SET_UNAUTHENTICATED,
    })
  ).toEqual(initialState)
})

it('should handle SET_USER', () => {
  const testUserInfo = {
    name: 'testName',
    email: 'test@email.com',
    role: { id: 0, name: 'roleName' },
    city: { id: 0, name: 'cityName' },
    id: 0,
  }
  expect(
    userReducer(initialState, {
      type: Types.SET_USER,
      payload: testUserInfo,
    })
  ).toEqual({
    authenticated: true,
    loading: false,
    userInfo: testUserInfo,
  })
})

it('should handle LOADING_USER', () => {
  expect(
    userReducer(initialState, {
      type: Types.LOADING_USER,
    })
  ).toEqual({
    loading: true,
    authenticated: initialState.authenticated,
    userInfo: initialState.userInfo,
  })
})
