import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import SlideType from './SlideType'

it('renders slidetype', () => {
  render(
    <Provider store={store}>
      <SlideType activeSlide={{ id: 5 } as RichSlide} competitionId="1" />
    </Provider>
  )
})
