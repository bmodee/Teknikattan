import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import store from '../../../../store'
import Images from './Images'

it('renders images', () => {
  render(
    <Provider store={store}>
      <Images activeSlide={{ id: 5 } as RichSlide} activeViewTypeId={5} competitionId="1" />
    </Provider>
  )
})
