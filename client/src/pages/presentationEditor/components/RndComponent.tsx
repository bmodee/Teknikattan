import { Button, Card, IconButton, Tooltip, Typography } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { ComponentTypes } from '../../../enum/ComponentTypes'
import { useAppSelector } from '../../../hooks'
import { Component, ImageComponent, QuestionAlternativeComponent, TextComponent } from '../../../interfaces/ApiModels'
import { Position, Size } from '../../../interfaces/Components'
import CheckboxComponent from './CheckboxComponent'
import ImageComponentDisplay from './ImageComponentDisplay'
import { HoverContainer } from './styled'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'

type ImageComponentProps = {
  component: Component
  width: number
  height: number
}

const RndComponent = ({ component, width, height }: ImageComponentProps) => {
  //Makes scale close to 1, 800 height is approxemately for a 1920 by 1080 monitor
  const scale = height / 800
  const [hover, setHover] = useState(false)
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  const [currentSize, setCurrentSize] = useState<Size>({ w: component.w, h: component.h })
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const slideId = useAppSelector((state) => state.editor.activeSlideId)
  const [shiftPressed, setShiftPressed] = useState(false)
  const handleUpdatePos = (pos: Position) => {
    axios.put(`/api/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      x: pos.x,
      y: pos.y,
    })
  }
  const handleUpdateSize = (size: Size) => {
    axios.put(`/api/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      w: size.w,
      h: size.h,
    })
  }
  const handleCenterHorizontal = () => {
    console.log(width, currentSize.w)
    const centerX = width / (2 * scale) - currentSize.w / 2
    setCurrentPos({ x: centerX, y: currentPos.y })
    handleUpdatePos({ x: centerX, y: currentPos.y })
  }
  const handleCenterVertical = () => {
    console.log(height, currentSize.h)
    const centerY = height / (2 * scale) - currentSize.h / 2
    setCurrentPos({ x: currentPos.x, y: centerY })
    handleUpdatePos({ x: currentPos.x, y: centerY })
  }
  useEffect(() => {
    const downHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Shift') setShiftPressed(true)
    }
    const upHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Shift') setShiftPressed(false)
    }
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  const renderInnerComponent = () => {
    switch (component.type_id) {
      case ComponentTypes.Text:
        return (
          <HoverContainer
            hover={hover}
            dangerouslySetInnerHTML={{
              __html: `<div style="font-size: ${Math.round(24 * scale)}px;">${
                (component as TextComponent).data.text
              }</div>`,
            }}
          />
        )
      case ComponentTypes.Image:
        return (
          <HoverContainer hover={hover}>
            <img
              key={component.id}
              src={`/static/images/${(component as ImageComponent).data.filename}`}
              height={currentSize.h * scale}
              width={currentSize.w * scale}
              draggable={false}
            />
          </HoverContainer>
        )
      case ComponentTypes.Image:
        return (
          <HoverContainer hover={hover}>
            <img
              key={component.id}
              src={`/static/images/${(component as ImageComponent).data.filename}`}
              height={currentSize.h * scale}
              width={currentSize.w * scale}
              draggable={false}
            />
          </HoverContainer>
        )
      default:
        break
    }
  }

  return (
    <Rnd
      minWidth={75 * scale}
      minHeight={75 * scale}
      bounds="parent"
      onDragStop={(e, d) => {
        //Have to divide by scale since d is position on current screen
        setCurrentPos({ x: d.x / scale, y: d.y / scale })
        handleUpdatePos({ x: d.x / scale, y: d.y / scale })
      }}
      lockAspectRatio={shiftPressed}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      //Multiply by scale to show components correctly for current screen size
      size={{ width: currentSize.w * scale, height: currentSize.h * scale }}
      position={{ x: currentPos.x * scale, y: currentPos.y * scale }}
      onResizeStop={(e, direction, ref, delta, position) => {
        handleUpdateSize({ w: currentSize.w, h: currentSize.h })
        handleUpdatePos({ x: currentPos.x, y: currentPos.y })
      }}
      onResize={(e, direction, ref, delta, position) => {
        //Have to divide by scale since ref has position on current screen
        setCurrentSize({
          w: ref.offsetWidth / scale,
          h: ref.offsetHeight / scale,
        })
      }}
    >
      {hover && (
        <Card elevation={6} style={{ position: 'absolute' }}>
          <Tooltip title="Centrera horisontellt">
            <IconButton onClick={handleCenterHorizontal}>X</IconButton>
          </Tooltip>
          <Tooltip title="Centrera Vertikalt">
            <IconButton onClick={handleCenterVertical}>Y</IconButton>
          </Tooltip>
        </Card>
      )}
      {renderInnerComponent()}
    </Rnd>
  )
}

export default RndComponent
