import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store'
import SlideDisplay from './SlideDisplay'

it('renders slide display', () => {
  render(
    <Provider store={store}>
      <SlideDisplay />
    </Provider>
  )
})
