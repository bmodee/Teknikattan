import { Checkbox } from '@material-ui/core'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { Component } from '../../../interfaces/ApiModels'
import { Position } from '../../../interfaces/Components'

type CheckboxComponentProps = {
  component: Component
}

const CheckboxComponent = ({ component }: CheckboxComponentProps) => {
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  return (
    <Rnd
      bounds="parent"
      onDragStop={(e, d) => {
        setCurrentPos({ x: d.x, y: d.y })
      }}
      position={{ x: currentPos.x, y: currentPos.y }}
    >
      <Checkbox
        disableRipple
        style={{
          transform: 'scale(3)',
        }}
      />
    </Rnd>
  )
}

export default CheckboxComponent
