import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { TextComponent } from '../../../interfaces/ApiModels'
import store from '../../../store'
import TextComponentEdit from './TextComponentEdit'

it('renders text component edit', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <TextComponentEdit component={{ id: 2, text: 'testtext' } as TextComponent} />
      </Provider>
    </BrowserRouter>
  )
})
