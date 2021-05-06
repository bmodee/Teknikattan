import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import MultipleChoiceAlternatives from './MultipleChoiceAlternatives'

it('renders multiple choice alternatives', () => {
  render(
    <Provider store={store}>
      <MultipleChoiceAlternatives activeSlide={{ id: 5 } as RichSlide} competitionId="1" />
    </Provider>
  )
})
