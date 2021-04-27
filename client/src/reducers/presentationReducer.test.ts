import Types from '../actions/types'
import { RichSlide } from '../interfaces/ApiRichModels'
import { Slide } from '../interfaces/ApiModels'
import presentationReducer from './presentationReducer'

const initialState = {
  competition: {
    name: '',
    id: 0,
    city_id: 0,
    slides: [],
    year: 0,
    teams: [],
  },
  slide: {
    competition_id: 0,
    id: 0,
    order: 0,
    timer: 0,
    title: '',
  },
  code: '',
  timer: {
    enabled: false,
    value: 0,
  },
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
    slide: testCompetition.slides[0],
    code: initialState.code,
    timer: initialState.timer,
  })
})

it('should handle SET_PRESENTATION_SLIDE', () => {
  const testSlide = [
    {
      competition_id: 20,
      id: 4,
      order: 3,
      timer: 123,
      title: 'testSlideTitle',
    },
  ]
  expect(
    presentationReducer(initialState, {
      type: Types.SET_PRESENTATION_SLIDE,
      payload: testSlide,
    })
  ).toEqual({
    competition: initialState.competition,
    slide: testSlide,
    code: initialState.code,
    timer: initialState.timer,
  })
})

describe('should handle SET_PRESENTATION_SLIDE_PREVIOUS', () => {
  it('by changing slide to the previous if there is one', () => {
    const testPresentationState = {
      competition: {
        ...initialState.competition,
        slides: [
          { competition_id: 0, order: 0 },
          { competition_id: 0, order: 1 },
        ] as RichSlide[],
        teams: [],
      },
      slide: { competition_id: 0, order: 1 } as Slide,
      code: initialState.code,
      timer: initialState.timer,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_PREVIOUS,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[0],

      code: initialState.code,
      timer: initialState.timer,
    })
  })
  it('by not changing slide if there is no previous one', () => {
    const testPresentationState = {
      competition: {
        ...initialState.competition,
        slides: [
          { competition_id: 0, order: 0 },
          { competition_id: 0, order: 1 },
        ] as RichSlide[],
        teams: [],
      },
      slide: { competition_id: 0, order: 0 } as Slide,
      code: initialState.code,
      timer: initialState.timer,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_PREVIOUS,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[0],
      code: initialState.code,
      timer: initialState.timer,
    })
  })
})

describe('should handle SET_PRESENTATION_SLIDE_NEXT', () => {
  it('by changing slide to the next if there is one', () => {
    const testPresentationState = {
      competition: {
        ...initialState.competition,
        slides: [
          { competition_id: 0, order: 0 },
          { competition_id: 0, order: 1 },
        ] as RichSlide[],
        teams: [],
      },
      slide: { competition_id: 0, order: 0 } as Slide,
      code: initialState.code,
      timer: initialState.timer,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_NEXT,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[1],
      code: initialState.code,
      timer: initialState.timer,
    })
  })
  it('by not changing slide if there is no next one', () => {
    const testPresentationState = {
      competition: {
        ...initialState.competition,
        slides: [
          { competition_id: 0, order: 0 },
          { competition_id: 0, order: 1 },
        ] as RichSlide[],
        teams: [],
      },
      slide: { competition_id: 0, order: 1 } as Slide,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_NEXT,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[1],
    })
  })
})
