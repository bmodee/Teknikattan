/**
 * This file contains the RndComponent function, which returns a resizable and draggable component.
 * This component is used by text, image and question components in the presentation editor.
 * It uses the React-Rnd library.
 */
import { Card, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { getEditorCompetition } from '../../../actions/editor'
import { ComponentTypes } from '../../../enum/ComponentTypes'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { Component, ImageComponent, TextComponent } from '../../../interfaces/ApiModels'
import { Position, Size } from '../../../interfaces/Components'
import { RemoveMenuItem } from '../../admin/styledComp'
import ImageComponentDisplay from './ImageComponentDisplay'
import QuestionComponentDisplay from './QuestionComponentDisplay'
import { HoverContainer } from './styled'
import TextComponentDisplay from './TextComponentDisplay'
//import NestedMenuItem from 'material-ui-nested-menu-item'

type RndComponentProps = {
  component: Component
  width: number
  height: number
  scale: number
}

/** State for right click menu; closed initially */
const initialMenuState = { menuIsOpen: false, mouseX: null, mouseY: null, componentId: null }

/** Creates and renders a resizable and draggable component */
const RndComponent = ({ component, width, height, scale }: RndComponentProps) => {
  //States
  const [hover, setHover] = useState(false)
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  const [currentSize, setCurrentSize] = useState<Size>({ w: component.w, h: component.h })
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const slideId = useAppSelector((state) => state.editor.activeSlideId)
  const [shiftPressed, setShiftPressed] = useState(false)
  const typeName = useAppSelector(
    (state) => state.types.componentTypes.find((componentType) => componentType.id === component.type_id)?.name
  )
  /** State for right click menu */
  const [menuState, setMenuState] = useState<{
    menuIsOpen: boolean
    mouseX: null | number
    mouseY: null | number
    componentId: null | number
  }>(initialMenuState)
  const dispatch = useAppDispatch()

  /** Sets position of the component in the database */
  const handleUpdatePos = (pos: Position) => {
    axios.put(`/api/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      x: pos.x,
      y: pos.y,
    })
  }

  /** Sets size of the component in the database */
  const handleUpdateSize = (size: Size) => {
    axios.put(`/api/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      w: size.w,
      h: size.h,
    })
  }

  /** Positions the component centered horizontally */
  const handleCenterHorizontal = () => {
    const centerX = width / (2 * scale) - currentSize.w / 2
    setCurrentPos({ x: centerX, y: currentPos.y })
    handleUpdatePos({ x: centerX, y: currentPos.y })
  }

  /** Positions the component centered vertically */
  const handleCenterVertical = () => {
    const centerY = height / (2 * scale) - currentSize.h / 2
    setCurrentPos({ x: currentPos.x, y: centerY })
    handleUpdatePos({ x: currentPos.x, y: centerY })
  }

  /** Opens right click context menu */
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, componentId: number) => {
    event.preventDefault() //Prevents browser-native context menu from being opened
    setMenuState({
      menuIsOpen: true,
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      componentId: componentId,
    })
  }

  /** Closes right click context menu */
  const handleCloseMenu = () => {
    setMenuState(initialMenuState)
  }

  /** Creates a copy of the component in the database. The copy will be placed in the supplied slide type (e.g. viewer, participant). */
  const handleDuplicateComponent = async (viewTypeId: number) => {
    console.log('Duplicate')
    await axios
      .post(
        `/api/competitions/${competitionId}/slides/${slideId}/components/${menuState.componentId}/copy/${viewTypeId}`
      )
      .then(() => dispatch(getEditorCompetition(competitionId.toString())))
      .catch(console.log)
    setMenuState(initialMenuState)
  }

  /** Deletes the component from the database */
  const handleRemoveComponent = async () => {
    console.log('Remove')
    await axios
      .delete(`/api/competitions/${competitionId}/slides/${slideId}/components/${menuState.componentId}`)
      .then(() => dispatch(getEditorCompetition(competitionId.toString())))
      .catch(console.log)
    setMenuState(initialMenuState)
  }

  /** Handles key presses:
   * -Holding down shift retains the aspect ratio of the component when resizing
   */
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

  /** Renders the contained text, image och question component */
  const renderInnerComponent = () => {
    switch (component.type_id) {
      case ComponentTypes.Text:
        return (
          <HoverContainer hover={hover}>
            <TextComponentDisplay component={component as TextComponent} scale={scale} />
          </HoverContainer>
        )
      case ComponentTypes.Image:
        return (
          <HoverContainer hover={hover}>
            <ImageComponentDisplay
              height={currentSize.h * scale}
              width={currentSize.w * scale}
              component={component as ImageComponent}
            />
          </HoverContainer>
        )
      case ComponentTypes.Question:
        return (
          <HoverContainer hover={hover}>
            <QuestionComponentDisplay variant="editor" />
          </HoverContainer>
        )
      default:
        break
    }
  }

  return (
    /** Renders an Rnd component from the react-rnd library */
    <Rnd
      minWidth={75 * scale}
      minHeight={75 * scale}
      bounds="parent"
      onDragStop={(e, d) => {
        //Have to divide by scale since d is position on current screen
        setCurrentPos({ x: d.x / scale, y: d.y / scale })
        handleUpdatePos({ x: d.x / scale, y: d.y / scale })
      }}
      //Makes text appear on images
      style={{ zIndex: typeName === 'Text' ? 2 : 1 }}
      lockAspectRatio={shiftPressed}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      //Right click to open menu
      onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => handleRightClick(event, component.id)}
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
        setCurrentPos({ x: position.x / scale, y: position.y / scale })
      }}
    >
      {/** Buttons for centering the component */}
      {hover && (
        <Card elevation={6} style={{ position: 'absolute', zIndex: 10 }}>
          <Tooltip title="Centrera horisontellt">
            <IconButton onClick={handleCenterHorizontal}>X</IconButton>
          </Tooltip>
          <Tooltip title="Centrera Vertikalt">
            <IconButton onClick={handleCenterVertical}>Y</IconButton>
          </Tooltip>
        </Card>
      )}
      {renderInnerComponent()}
      {/** Context menu */}
      <Menu
        keepMounted
        open={menuState.menuIsOpen}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuState.mouseY !== null && menuState.mouseX !== null
            ? { top: menuState.mouseY, left: menuState.mouseX }
            : undefined
        }
      >
        {/* <NestedMenuItem label="Duplicera"> */}
        <MenuItem onClick={() => handleDuplicateComponent(3)}>Duplicera till åskådarvy</MenuItem>
        <MenuItem onClick={() => handleDuplicateComponent(1)}>Duplicera till deltagarvy</MenuItem>
        {/* </NestedMenuItem> */}
        <RemoveMenuItem onClick={handleRemoveComponent}>Ta bort</RemoveMenuItem>
      </Menu>
    </Rnd>
  )
}

export default RndComponent
