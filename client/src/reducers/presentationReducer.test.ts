import Types from '../actions/types'
import presentationReducer from './presentationReducer'

const initialState = {
  competition: {
    name: '',
    id: 1,
    background_image: undefined,
    city_id: 0,
    slides: [],
    year: 0,
    teams: [],
  },
  activeSlideId: -1,
  code: '',
  timer: {
    value: null,
    enabled: false,
  },
  show_scoreboard: false,
}

it('should return the initial state', () => {
  expect(presentationReducer(undefined, {} as any)).toEqual(initialState)
})

it('should handle SET_PRESENTATION_COMPETITION', () => {
  const testCompetition = {
    name: 'testCompName',
    id: 4,
    city: {
      id: 3,
      name: 'testCityName',
    },
    slides: [{ id: 20 }],
    year: 1999,
  }
  expect(
    presentationReducer(initialState, {
      type: Types.SET_PRESENTATION_COMPETITION,
      payload: testCompetition,
    })
  ).toEqual({
    competition: testCompetition,
    activeSlideId: initialState.activeSlideId,
    code: initialState.code,
    timer: initialState.timer,
    show_scoreboard: initialState.show_scoreboard,
  })
})

it('should handle SET_PRESENTATION_SLIDE_ID', () => {
  const testSlideId = 123123123
  expect(
    presentationReducer(initialState, {
      type: Types.SET_PRESENTATION_SLIDE_ID,
      payload: testSlideId,
    })
  ).toEqual({
    competition: initialState.competition,
    activeSlideId: testSlideId,
    code: initialState.code,
    timer: initialState.timer,
    show_scoreboard: initialState.show_scoreboard,
  })
})
