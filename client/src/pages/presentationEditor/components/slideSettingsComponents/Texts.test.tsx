import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import Texts from './Texts'

it('renders texts', () => {
  render(
    <Provider store={store}>
      <Texts activeSlide={{ id: 5 } as RichSlide} activeViewTypeId={5} competitionId="1" />
    </Provider>
  )
})
