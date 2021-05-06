import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import QuestionSettings from './QuestionSettings'

it('renders question settings', () => {
  render(
    <Provider store={store}>
      <QuestionSettings activeSlide={{ id: 5 } as RichSlide} competitionId="1" />
    </Provider>
  )
})
