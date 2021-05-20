import React from 'react'
import { TextComponent } from '../../../interfaces/ApiModels'

type TextComponentDisplayProps = {
  component: TextComponent
  scale: number
}

const ImageComponentDisplay = ({ component, scale }: TextComponentDisplayProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<div style="font-size: ${Math.round(24 * scale)}px;">${component.text}</div>`,
      }}
    />
  )
}

export default ImageComponentDisplay
