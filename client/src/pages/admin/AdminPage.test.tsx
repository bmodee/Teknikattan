import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import AdminPage from './AdminPage'

it('renders admin view', () => {
  const cityRes: any = {
    data: {
      items: [
        {
          id: 1,
          name: 'Link\u00f6ping',
        },
        {
          id: 2,
          name: 'Stockholm',
        },
      ],
      count: 2,
      total_count: 3,
    },
  }
  const rolesRes: any = {
    data: {
      items: [
        {
          id: 1,
          name: 'role1',
        },
        {
          id: 2,
          name: 'role2',
        },
      ],
      count: 2,
      total_count: 3,
    },
  }
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    if (path === '/misc/cities') return Promise.resolve(cityRes)
    else return Promise.resolve(rolesRes)
  })
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    </Provider>
  )
})
