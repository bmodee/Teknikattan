/**
 * This file contains the ImageComponentDisplay function, which returns an image component.
 * This component is used to display images in an active competition presentation or in the editor.
 * When used in the editor, the image component is wrapped in an Rnd component, to make it editable.
 */
import React from 'react'
import { ImageComponent } from '../../../interfaces/ApiModels'

type ImageComponentProps = {
  component: ImageComponent
  width: number
  height: number
}

/** Creates and renders and image component */
const ImageComponentDisplay = ({ component, width, height }: ImageComponentProps) => {
  return (
    <img
      src={`http://localhost:5000/static/images/${component.media?.filename}`}
      height={height}
      width={width}
      // Make sure the border looks good all around the image
      style={{ paddingRight: 2, paddingBottom: 2 }}
      draggable={false}
    />
  )
}

export default ImageComponentDisplay
