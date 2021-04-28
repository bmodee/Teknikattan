import { Typography } from '@material-ui/core'
import React from 'react'
import { Rnd } from 'react-rnd'
import { ComponentTypes } from '../../../enum/ComponentTypes'
import { useAppSelector } from '../../../hooks'
import { Component, ImageComponent, TextComponent } from '../../../interfaces/ApiModels'
import ImageComponentDisplay from '../../presentationEditor/components/ImageComponentDisplay'
import TextComponentDisplay from '../../presentationEditor/components/TextComponentDisplay'
import { SlideContainer } from './styled'

type PresentationComponentProps = {
  component: Component
  width: number
  height: number
  scale: number
}

const PresentationComponent = ({ component, width, height, scale }: PresentationComponentProps) => {
  const renderInnerComponent = () => {
    switch (component.type_id) {
      case ComponentTypes.Text:
        return <TextComponentDisplay component={component as TextComponent} scale={scale} />
      case ComponentTypes.Image:
        return (
          <ImageComponentDisplay
            height={component.h * scale}
            width={component.w * scale}
            component={component as ImageComponent}
          />
        )
      default:
        break
    }
  }
  return (
    <Rnd
      minWidth={75 * scale}
      minHeight={75 * scale}
      disableDragging={true}
      enableResizing={false}
      bounds="parent"
      //Multiply by scale to show components correctly for current screen size
      size={{ width: component.w * scale, height: component.h * scale }}
      position={{ x: component.x * scale, y: component.y * scale }}
    >
      {renderInnerComponent()}
    </Rnd>
  )
}

export default PresentationComponent
