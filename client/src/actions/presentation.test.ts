import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Slide } from '../interfaces/ApiModels'
import { getPresentationCompetition, setCurrentSlideByOrder } from './presentation'
import Types from './types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('dispatches no actions when failing to get competitions', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject(new Error('getting competitions failed'))
  })
  const store = mockStore({ competitions: { filterParams: [] } })
  await getPresentationCompetition('0')(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual([])
  expect(console.log).toHaveBeenCalled()
})

it('dispatches correct actions when setting slide', () => {
  const testSlide: Slide = {
    competition_id: 0,
    id: 123123,
    order: 43523,
    timer: 20,
    title: '',
    background_image: undefined,
  }
  const expectedActions = [{ type: Types.SET_PRESENTATION_SLIDE_ID, payload: testSlide.id }]
  const store = mockStore({ presentation: { competition: { id: 2, slides: [testSlide] } } })
  setCurrentSlideByOrder(testSlide.order)(store.dispatch, store.getState as any)
  expect(store.getActions()).toEqual(expectedActions)
})
