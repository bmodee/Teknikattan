import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import TeamViewPage from './TeamViewPage'

it('renders participant view page', () => {
  const res = {
    data: { slides: [{ id: 5 }] },
  }
  ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
    return Promise.resolve(res)
  })
  render(
    <BrowserRouter>
      <Provider store={store}>
        <TeamViewPage />
      </Provider>
    </BrowserRouter>
  )
})
