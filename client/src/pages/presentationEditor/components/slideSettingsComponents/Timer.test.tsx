import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import Timer from './Timer'

it('renders timer', () => {
  render(
    <Provider store={store}>
      <Timer activeSlide={{ id: 5 } as RichSlide} competitionId="1" />
    </Provider>
  )
})
