import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { CompetitionFilterParams } from './../interfaces/FilterParams'
import { getCompetitions, setFilterParams } from './competitions'
import Types from './types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('dispatches correct actions when getting competitions', async () => {
  const compRes: any = {
    data: {
      items: [
        {
          id: 21,
          name: 'ggff',
          year: 2021,
          style_id: 1,
          city: { name: 'city_name', id: 5 },
        },
        {
          id: 22,
          name: 'sssss',
          year: 2021,
          style_id: 1,
          city: { name: 'city_name', id: 5 },
        },
      ],
      count: 2,
      total_count: 3,
    },
  }

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(compRes)
  })
  const expectedActions = [
    { type: Types.SET_COMPETITIONS, payload: compRes.data.items },
    { type: Types.SET_COMPETITIONS_TOTAL, payload: compRes.data.total_count },
    { type: Types.SET_COMPETITIONS_COUNT, payload: compRes.data.count },
  ]
  const store = mockStore({ competitions: { filterParams: [] } })
  await getCompetitions()(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches correct actions when setting filterParams', () => {
  const testFilterParams: CompetitionFilterParams = {
    page: 0,
    pageSize: 3,
    name: 'name',
    cityId: 0,
    styleId: 0,
    year: 2000,
  }
  const expectedActions = [{ type: Types.SET_COMPETITIONS_FILTER_PARAMS, payload: testFilterParams }]
  const store = mockStore({})
  setFilterParams(testFilterParams)(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches no actions when failing to get competitions', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject(new Error('getting competitions failed'))
  })
  const store = mockStore({ competitions: { filterParams: [] } })
  await getCompetitions()(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual([])
  expect(console.log).toHaveBeenCalled()
})
