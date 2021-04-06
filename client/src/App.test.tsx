import { render } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

test('renders app', async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })
})
