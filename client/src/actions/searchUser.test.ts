import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { UserFilterParams } from './../interfaces/FilterParams'
import { getSearchUsers, setFilterParams } from './searchUser'
import Types from './types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
it('dispatches correct actions when getting users', async () => {
  const userRes: any = {
    data: [
      {
        id: 21,
        name: 'ggff',
        email: 'email@test.com',
        year: 2021,
        role_id: 1,
        city_id: 0,
      },
      {
        id: 22,
        name: 'sssss',
        email: 'email@test.com',
        year: 2021,
        role_id: 1,
        city_id: 0,
      },
    ],
    headers: {
      pagination: '{"count": 2,"total": 3, "page_size":5 }',
    },
  }

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(userRes)
  })
  const expectedActions = [
    { type: Types.SET_SEARCH_USERS, payload: userRes.data },
    { type: Types.SET_SEARCH_USERS_TOTAL_COUNT, payload: 3 },
    { type: Types.SET_SEARCH_USERS_COUNT, payload: userRes.data.length },
  ]
  const store = mockStore({ searchUsers: { filterParams: [] } })
  await getSearchUsers()(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches correct actions when setting filterParams', () => {
  const testFilterParams: UserFilterParams = {
    page: 0,
    pageSize: 3,
    name: 'name',
    cityId: 0,
    email: 'email@test.com',
    roleId: 0,
  }
  const expectedActions = [{ type: Types.SET_SEARCH_USERS_FILTER_PARAMS, payload: testFilterParams }]
  const store = mockStore({})
  setFilterParams(testFilterParams)(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches no actions when failing to get users', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject(new Error('getting users failed'))
  })
  const store = mockStore({ searchUsers: { filterParams: [] } })
  await getSearchUsers()(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual([])
  expect(console.log).toHaveBeenCalled()
})
