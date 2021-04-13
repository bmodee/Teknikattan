import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import EditUser from './EditUser'

it('renders edit user', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <EditUser user={{ id: 0, name: '', email: '', role_id: 0, city_id: 0 }} />
      </Provider>
    </BrowserRouter>
  )
})
