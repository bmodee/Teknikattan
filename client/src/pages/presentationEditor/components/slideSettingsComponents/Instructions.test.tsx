import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import Instructions from './Instructions'

it('renders instructions', () => {
  render(
    <Provider store={store}>
      <Instructions activeSlide={{ id: 5 } as RichSlide} competitionId="1" />
    </Provider>
  )
})
