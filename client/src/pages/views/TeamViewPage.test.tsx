import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import TeamViewPage from './TeamViewPage'
import mockedAxios from 'axios'

it('renders participant view page', () => {
  const res = {
    data: {},
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