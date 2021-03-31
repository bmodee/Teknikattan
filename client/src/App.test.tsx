import React from 'react'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

test('renders app', () => {
  ;<Provider store={store}>
    render(
    <App />)
  </Provider>
  // const linkElement = screen.getByText(/learn react/i)
  // expect(linkElement).toBeInTheDocument()
})
