import Types from '../actions/types'
import { RichSlide } from '../interfaces/ApiRichModels'
import { Slide } from '../interfaces/Slide'
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
  teams: [],
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
    teams: [],
  }
  expect(
    presentationReducer(initialState, {
      type: Types.SET_PRESENTATION_COMPETITION,
      payload: testCompetition,
    })
  ).toEqual({
    competition: testCompetition,
    slide: testCompetition.slides[0],
    teams: [],
  })
})

it('should handle SET_PRESENTATION_TEAMS', () => {
  const testTeams = [
    {
      name: 'testTeamName1',
      id: 3,
    },
    {
      name: 'testTeamName2',
      id: 5,
    },
  ]
  expect(
    presentationReducer(initialState, {
      type: Types.SET_PRESENTATION_TEAMS,
      payload: testTeams,
    })
  ).toEqual({
    competition: initialState.competition,
    slide: initialState.slide,
    teams: testTeams,
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
    teams: initialState.teams,
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
      },
      teams: initialState.teams,
      slide: { competition_id: 0, order: 1 } as Slide,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_PREVIOUS,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[0],
      teams: testPresentationState.teams,
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
      },
      teams: initialState.teams,
      slide: { competition_id: 0, order: 0 } as Slide,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_PREVIOUS,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[0],
      teams: testPresentationState.teams,
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
      },
      teams: initialState.teams,
      slide: { competition_id: 0, order: 0 } as Slide,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_NEXT,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[1],
      teams: testPresentationState.teams,
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
      },
      teams: initialState.teams,
      slide: { competition_id: 0, order: 1 } as Slide,
    }
    expect(
      presentationReducer(testPresentationState, {
        type: Types.SET_PRESENTATION_SLIDE_NEXT,
      })
    ).toEqual({
      competition: testPresentationState.competition,
      slide: testPresentationState.competition.slides[1],
      teams: testPresentationState.teams,
    })
  })
})
