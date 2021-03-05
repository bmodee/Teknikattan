import { render } from '@testing-library/react'
import React from 'react'
import LoginPage from './LoginPage'

it('renders login form', () => {
  render(<LoginPage />)
})
