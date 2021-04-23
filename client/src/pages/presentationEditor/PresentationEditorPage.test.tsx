import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import PresentationEditorPage from './PresentationEditorPage'

it('renders presentation editor', () => {
  const competitionRes: any = {
    data: {
      name: '',
      id: 0,
      year: 0,
      city_id: 0,
      slides: [{ id: 5 }],
      teams: [],
    },
  }
  const citiesRes: any = {
    data: {
      items: [
        {
          name: '',
          city_id: 0,
        },
      ],
    },
  }
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    if (path.startsWith('/api/competitions')) return Promise.resolve(competitionRes)
    return Promise.resolve(citiesRes)
  })
  render(
    <Provider store={store}>
      <BrowserRouter>
        <PresentationEditorPage />
      </BrowserRouter>
    </Provider>
  )
})
