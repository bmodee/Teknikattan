import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import ViewSelectPage from './ViewSelectPage'
import mockedAxios from 'axios'
import { act } from 'react-dom/test-utils'

it('renders view select page', async () => {
  await act(async () => {
    const res = {
      data: {},
    }
    ;(mockedAxios.post as jest.Mock).mockImplementation(() => {
      return Promise.resolve(res)
    })
    render(
      <BrowserRouter>
        <Provider store={store}>
          <ViewSelectPage />
        </Provider>
      </BrowserRouter>
    )
  })
})
