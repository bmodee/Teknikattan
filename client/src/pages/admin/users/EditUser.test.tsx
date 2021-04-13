import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import AddUser from './AddUser'

it('renders edit user', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <AddUser />
      </Provider>
    </BrowserRouter>
  )
})
