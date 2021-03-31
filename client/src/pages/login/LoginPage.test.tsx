import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store'
import LoginPage from './LoginPage'

it('renders login form', () => {
  render(
    <Provider store={store}>
      <LoginPage />
    </Provider>
  )
})
