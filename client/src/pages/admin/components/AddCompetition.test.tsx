import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import AddCompetition from './AddCompetition'

it('renders add competition', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <AddCompetition />
      </Provider>
    </BrowserRouter>
  )
})
