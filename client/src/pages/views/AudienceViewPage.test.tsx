import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store'
import AudienceViewPage from './AudienceViewPage'

it('renders audience view page', () => {
  render(
    <Provider store={store}>
      <AudienceViewPage />
    </Provider>
  )
})
