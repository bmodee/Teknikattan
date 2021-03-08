import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ViewSelectPage from './ViewSelectPage'

it('renders view select page', () => {
  render(
    <BrowserRouter>
      <ViewSelectPage />
    </BrowserRouter>
  )
})
