import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getRoles } from './roles'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('dispatches no actions when failing to get roles', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject(new Error('getting roles failed'))
  })
  const store = mockStore({ competitions: { filterParams: [] } })
  await getRoles()(store.dispatch)
  expect(store.getActions()).toEqual([])
  expect(console.log).toHaveBeenCalled();
})