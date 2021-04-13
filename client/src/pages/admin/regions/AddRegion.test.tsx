import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import AddRegion from './AddRegion'

it('renders add region', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <AddRegion />
      </Provider>
    </BrowserRouter>
  )
})
