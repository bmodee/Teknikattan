import axios from 'axios'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { ComponentTypes } from '../../../enum/ComponentTypes'
import { useAppSelector } from '../../../hooks'
import { Component, ImageComponent, TextComponent } from '../../../interfaces/ApiModels'
import { Position, Size } from '../../../interfaces/Components'
import CheckboxComponent from './CheckboxComponent'
import ImageComponentDisplay from './ImageComponentDisplay'
import { TextComponentContainer } from './styled'

type ImageComponentProps = {
  component: Component
}

const RndComponent = ({ component }: ImageComponentProps) => {
  const [hover, setHover] = useState(false)
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  const [currentSize, setCurrentSize] = useState<Size>({ w: component.w, h: component.h })
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const slideId = useAppSelector((state) => state.editor.activeSlideId)
  const handleUpdatePos = (pos: Position) => {
    // TODO: change path to /slides/${slideId}
    axios.put(`/competitions/${competitionId}/slides/0/components/${component.id}`, {
      x: pos.x,
      y: pos.y,
    })
  }
  const handleUpdateSize = (size: Size) => {
    // TODO: change path to /slides/${slideId}
    axios.put(`/competitions/${competitionId}/slides/0/components/${component.id}`, {
      w: size.w,
      h: size.h,
    })
  }

  const renderInnerComponent = () => {
    switch (component.type_id) {
      case ComponentTypes.Checkbox:
        return <CheckboxComponent key={component.id} component={component} />
      case ComponentTypes.Text:
        return (
          <TextComponentContainer
            hover={hover}
            dangerouslySetInnerHTML={{ __html: (component as TextComponent).data.text }}
          />
        )
      case ComponentTypes.Image:
        return <ImageComponentDisplay key={component.id} component={component as ImageComponent} />
      default:
        break
    }
  }

  return (
    <Rnd
      minWidth={50}
      minHeight={50}
      bounds="parent"
      onDragStop={(e, d) => {
        setCurrentPos({ x: d.x, y: d.y })
        handleUpdatePos(d)
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      size={{ width: currentSize.w, height: currentSize.h }}
      position={{ x: currentPos.x, y: currentPos.y }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setCurrentSize({
          w: ref.offsetWidth,
          h: ref.offsetHeight,
        })
        setCurrentPos(position)
        handleUpdateSize({ w: ref.offsetWidth, h: ref.offsetHeight })
        handleUpdatePos(position)
      }}
      onResize={(e, direction, ref, delta, position) =>
        setCurrentSize({
          w: ref.offsetWidth,
          h: ref.offsetHeight,
        })
      }
    >
      {renderInnerComponent()}
    </Rnd>
  )
}

export default RndComponent
