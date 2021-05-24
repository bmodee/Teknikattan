/**
 * This file contains the TextComponentDisplay function, which returns the text component used in competitions.
 * This component only displays the text, it cannot be edited.
 * When a text component is displayed in the editor, the file TextComponentEdit is used instead.
 */
import React from 'react'
import { TextComponent } from '../../../interfaces/ApiModels'

/** Creates and renders an image component displaying a text */
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
