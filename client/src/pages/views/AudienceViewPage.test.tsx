import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store'
import AudienceViewPage from './AudienceViewPage'

it('renders audience view page', () => {
  const typeRes: any = {
    data: { id: 5, slides: [{ id: 2 }] },
  }
  ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
    return Promise.resolve(typeRes)
  })
  render(
    <BrowserRouter>
      <Provider store={store}>
        <AudienceViewPage />
      </Provider>
    </BrowserRouter>
  )
})
