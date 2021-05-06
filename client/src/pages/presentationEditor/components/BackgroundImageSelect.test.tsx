import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import BackgroundImageSelect from './BackgroundImageSelect'

it('renders background image select', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <BackgroundImageSelect variant="competition" />
      </Provider>
    </BrowserRouter>
  )
})
