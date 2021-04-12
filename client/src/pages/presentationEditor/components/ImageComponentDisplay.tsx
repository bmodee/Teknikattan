import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { ImageComponent } from '../../../interfaces/ApiModels'
import { Position, Size } from '../../../interfaces/Components'

type ImageComponentProps = {
  component: ImageComponent
}

const ImageComponentDisplay = ({ component }: ImageComponentProps) => {
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  const [currentSize, setCurrentSize] = useState<Size>({ w: component.w, h: component.h })
  return (
    <Rnd
      minWidth={50}
      minHeight={50}
      bounds="parent"
      onDragStop={(e, d) => {
        setCurrentPos({ x: d.x, y: d.y })
      }}
      size={{ width: currentSize.w, height: currentSize.h }}
      position={{ x: currentPos.x, y: currentPos.y }}
      onResize={(e, direction, ref, delta, position) => {
        setCurrentSize({
          w: ref.offsetWidth,
          h: ref.offsetHeight,
        })
        setCurrentPos(position)
      }}
      onResizeStop={() => {
        console.log('Skicka data till server')
      }}
    >
      <img
        src="https://365psd.com/images/previews/c61/cartoon-cow-52394.png"
        height={currentSize.h}
        width={currentSize.w}
        draggable={false}
      />
    </Rnd>
  )
}

export default ImageComponentDisplay
