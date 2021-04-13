import Types from '../actions/types'
import uiReducer from './uiReducer'

const initialState = {
  loading: false,
  errors: null,
}

it('should return the initial state', () => {
  expect(uiReducer(undefined, {} as any)).toEqual(initialState)
})

it('should handle SET_ERRORS', () => {
  const testError = { message: 'errorMessage' }
  expect(
    uiReducer(initialState, {
      type: Types.SET_ERRORS,
      payload: testError,
    })
  ).toEqual({
    loading: false,
    errors: testError,
  })
})

it('should handle CLEAR_ERRORS', () => {
  expect(
    uiReducer(initialState, {
      type: Types.CLEAR_ERRORS,
    })
  ).toEqual({
    loading: false,
    errors: null,
  })
})
it('should handle LOADING_UI', () => {
  expect(
    uiReducer(initialState, {
      type: Types.LOADING_UI,
    })
  ).toEqual({
    loading: true,
    errors: initialState.errors,
  })
})
