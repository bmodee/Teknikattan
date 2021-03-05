import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import CompetitionManager from './CompetitionManager'

it('renders competition manager', () => {
  render(
    <BrowserRouter>
      <CompetitionManager />
    </BrowserRouter>
  )
})
