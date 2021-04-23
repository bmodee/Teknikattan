import { render } from '@testing-library/react'
import React from 'react'
import ImageComponentDisplay from './ImageComponentDisplay'

it('renders competition settings', () => {
  render(
    <ImageComponentDisplay
      component={{ id: 0, x: 0, y: 0, w: 0, h: 0, data: { media_id: 0, filename: '' }, type_id: 2 }}
      width={0}
      height={0}
    />
  )
})
