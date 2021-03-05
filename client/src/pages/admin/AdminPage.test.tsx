import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminPage from './AdminPage'

it('renders admin view', () => {
  render(
    <BrowserRouter>
      <AdminPage />
    </BrowserRouter>
  )
})
