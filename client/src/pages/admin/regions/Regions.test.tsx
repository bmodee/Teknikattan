import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import RegionManager from './Regions'

it('renders region manager', () => {
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

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(cityRes)
  })
  render(
    <BrowserRouter>
      <Provider store={store}>
        <RegionManager />
      </Provider>
    </BrowserRouter>
  )
})
