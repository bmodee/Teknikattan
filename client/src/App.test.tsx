import { render } from '@testing-library/react'
import mockedAxios from 'axios'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

test('renders app', async () => {
  await act(async () => {
    const typeRes: any = {
      data: { component_types: [], view_types: [], question_types: [], media_types: [] },
    }
    ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve(typeRes)
    })
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })
})
