import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import AdminPage from './AdminPage'

it('renders admin view', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    </Provider>
  )
})
