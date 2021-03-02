import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminView from './AdminView'

it('renders admin view', () => {
  render(
    <BrowserRouter>
      <AdminView />
    </BrowserRouter>
  )
})
