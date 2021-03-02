import { render } from '@testing-library/react'
import React from 'react'
import LoginForm from './Login'

it('renders login form', () => {
  render(<LoginForm />)
})
