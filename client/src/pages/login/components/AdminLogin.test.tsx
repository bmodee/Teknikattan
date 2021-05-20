import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store'
import AdminLogin from './AdminLogin'

/** Test AdminLogin */

it('renders admin login', () => {
  render(
    <Provider store={store}>
      <AdminLogin />
    </Provider>
  )
})
