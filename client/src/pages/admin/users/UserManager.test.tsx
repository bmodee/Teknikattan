import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import UserManager from './UserManager'

it('renders user manager', () => {
  const userRes: any = {
    data: {
      items: [
        {
          id: 1,
          name: 'user1',
          email: 'user1@email.com',
          role_id: 0,
          city_id: 0,
        },
        {
          id: 2,
          name: 'Stockholm',
          email: 'user2@email.com',
          role_id: 0,
          city_id: 0,
        },
      ],
      count: 2,
      total_count: 3,
    },
  }

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(userRes)
  })
  render(
    <BrowserRouter>
      <Provider store={store}>
        <UserManager />
      </Provider>
    </BrowserRouter>
  )
})
