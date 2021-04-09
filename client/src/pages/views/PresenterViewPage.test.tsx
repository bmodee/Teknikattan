import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import PresenterViewPage from './PresenterViewPage'

it('renders presenter view page', () => {
  const compRes: any = {
    data: {
      slides: [{ id: 0, title: '' }],
    },
  }
  const teamsRes: any = {
    data: {
      items: [
        {
          id: 1,
          name: 'team1',
        },
        {
          id: 2,
          name: 'team2',
        },
      ],
      count: 2,
      total_count: 3,
    },
  }

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    if (path.endsWith('/teams')) return Promise.resolve(teamsRes)
    else return Promise.resolve(compRes)
  })
  render(
    <BrowserRouter>
      <Provider store={store}>
        <PresenterViewPage />
      </Provider>
    </BrowserRouter>
  )
})
