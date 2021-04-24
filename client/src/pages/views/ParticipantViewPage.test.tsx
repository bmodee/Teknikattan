import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import ParticipantViewPage from './ParticipantViewPage'

it('renders participant view page', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <ParticipantViewPage />
      </Provider>
    </BrowserRouter>
  )
})
