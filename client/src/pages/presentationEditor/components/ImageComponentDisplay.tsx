import React from 'react'
import { ImageComponent } from '../../../interfaces/ApiModels'

type ImageComponentProps = {
  component: ImageComponent
  width: number
  height: number
}

const ImageComponentDisplay = ({ component, width, height }: ImageComponentProps) => {
  return (
    <img
      src={`http://localhost:5000/static/images/${component.media?.filename}`}
      height={height}
      width={width}
      draggable={false}
    />
  )
}

export default ImageComponentDisplay
