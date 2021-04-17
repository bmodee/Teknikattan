import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import SlideSettings from './SlideSettings'

it('renders slide settings', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SlideSettings />
      </BrowserRouter>
    </Provider>
  )
})
