import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import PresentationEditorPage from './PresentationEditorPage'

it('renders presentation editor', () => {
  render(
    <BrowserRouter>
      <PresentationEditorPage />
    </BrowserRouter>
  )
})
