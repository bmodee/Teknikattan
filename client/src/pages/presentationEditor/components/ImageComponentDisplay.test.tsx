import { render } from '@testing-library/react'
import React from 'react'
import ImageComponentDisplay from './ImageComponentDisplay'

it('renders competition settings', () => {
  render(<ImageComponentDisplay component={{ id: 0, x: 0, y: 0, w: 0, h: 0, media_id: 0, type: 2 }} />)
})
