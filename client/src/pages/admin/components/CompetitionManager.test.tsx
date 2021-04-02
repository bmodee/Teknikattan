import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import CompetitionManager from './CompetitionManager'

it('renders competition manager', () => {
  const cityRes: any = {
    data: [
      {
        id: 1,
        name: 'Link\u00f6ping',
      },
      {
        id: 2,
        name: 'Stockholm',
      },
    ],
  }
  const compRes: any = {
    data: {
      competitions: [
        {
          id: 21,
          name: 'ggff',
          year: 2021,
          style_id: 1,
          city_id: 1,
        },
        {
          id: 22,
          name: 'sssss',
          year: 2021,
          style_id: 1,
          city_id: 1,
        },
      ],
      count: 2,
      total: 3,
    },
  }

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    if (path === '/competitions/search') return Promise.resolve(compRes)
    else return Promise.resolve(cityRes)
  })
  render(
    <BrowserRouter>
      <Provider store={store}>
        <CompetitionManager />
      </Provider>
    </BrowserRouter>
  )
})
