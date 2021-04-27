import mockedAxios from 'axios'
import expect from 'expect' // You can use any testing library
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Slide } from '../interfaces/ApiModels'
import {
  getPresentationCompetition,
  setCurrentSlide,
  setCurrentSlideNext,
  setCurrentSlidePrevious,
} from './presentation'
import Types from './types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('dispatches no actions when failing to get competitions', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject(new Error('getting competitions failed'))
  })
  const store = mockStore({ competitions: { filterParams: [] } })
  await getPresentationCompetition('0')(store.dispatch)
  expect(store.getActions()).toEqual([])
  expect(console.log).toHaveBeenCalled()
})

it('dispatches correct actions when setting slide', () => {
  const testSlide: Slide = { competition_id: 0, id: 5, order: 5, timer: 20, title: '' }
  const expectedActions = [{ type: Types.SET_PRESENTATION_SLIDE, payload: testSlide }]
  const store = mockStore({})
  setCurrentSlide(testSlide)(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches correct actions when setting previous slide', () => {
  const expectedActions = [{ type: Types.SET_PRESENTATION_SLIDE_PREVIOUS }]
  const store = mockStore({})
  setCurrentSlidePrevious()(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
})

it('dispatches correct actions when setting next slide', () => {
  const expectedActions = [{ type: Types.SET_PRESENTATION_SLIDE_NEXT }]
  const store = mockStore({})
  setCurrentSlideNext()(store.dispatch)
  expect(store.getActions()).toEqual(expectedActions)
})
