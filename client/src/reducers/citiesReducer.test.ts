import Types from '../actions/types'
import citiesReducer from './citiesReducer'

const initialState = {
  cities: [],
  total: 0,
  count: 0,
}

it('should return the initial state', () => {
  expect(citiesReducer(undefined, {} as any)).toEqual(initialState)
})

it('should handle SET_CITIES', () => {
  const testCities = [{ name: 'testName', id: 0 }]
  expect(
    citiesReducer(initialState, {
      type: Types.SET_CITIES,
      payload: testCities,
    })
  ).toEqual({
    cities: testCities,
    total: 0,
    count: 0,
  })
})

it('should handle SET_CITIES_TOTAL', () => {
  const testTotal = 123123
  expect(
    citiesReducer(initialState, {
      type: Types.SET_CITIES_TOTAL,
      payload: testTotal,
    })
  ).toEqual({
    cities: [],
    total: testTotal,
    count: 0,
  })
})
it('should handle SET_CITIES_COUNT', () => {
  const testCount = 456456
  expect(
    citiesReducer(initialState, {
      type: Types.SET_CITIES_COUNT,
      payload: testCount,
    })
  ).toEqual({
    cities: [],
    total: 0,
    count: testCount,
  })
})
