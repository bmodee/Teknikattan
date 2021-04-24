import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store'
import CompetitionLogin from './CompetitionLogin'

it('renders competition login', () => {
  render(
    <Provider store={store}>
      <CompetitionLogin />
    </Provider>
  )
})
