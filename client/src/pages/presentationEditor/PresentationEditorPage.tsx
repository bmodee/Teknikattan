/**
 * This file contains the PresentationEditorPage function, which returns the presentation editor page component.
 * This component is used when editing a presentation, and allows creating, modifying and deleting
 * slides, questions, text components, image components, teams, and any other data relating to a competition.
 *
 */

import { Button, ButtonGroup, CircularProgress, Divider, Menu, MenuItem } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import ListItemText from '@material-ui/core/ListItemText'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { Link, useParams } from 'react-router-dom'
import { getCities } from '../../actions/cities'
import { getEditorCompetition, setEditorSlideId, setEditorViewId } from '../../actions/editor'
import { getTypes } from '../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { RichSlide } from '../../interfaces/ApiRichModels'
import { renderSlideIcon } from '../../utils/renderSlideIcon'
import { RemoveMenuItem } from '../admin/styledComp'
import { Content, InnerContent } from '../views/styled'
import SettingsPanel from './components/SettingsPanel'
import SlideDisplay from './components/SlideDisplay'
import {
  AppBarEditor,
  CenteredSpinnerContainer,
  CompetitionName,
  FillLeftContainer,
  FillRightContainer,
  HomeIcon,
  LeftDrawer,
  PositionBottom,
  PresentationEditorContainer,
  RightDrawer,
  RightPanelScroll,
  SlideList,
  SlideListItem,
  ToolBarContainer,
  ToolbarMargin,
  ViewButton,
} from './styled'

const initialState = {
  mouseX: null,
  mouseY: null,
  slideId: null,
}

const leftDrawerWidth = 150
const rightDrawerWidth = 390

interface CompetitionParams {
  competitionId: string
}

/** Creates and renders the presentation editor page */
const PresentationEditorPage: React.FC = () => {
  const { competitionId }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  //Available state variables:
  const [sortedSlides, setSortedSlides] = useState<RichSlide[]>([])
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const activeViewTypeId = useAppSelector((state) => state.editor.activeViewTypeId)
  const competition = useAppSelector((state) => state.editor.competition)
  const competitionLoading = useAppSelector((state) => state.editor.loading)
  useEffect(() => {
    dispatch(getTypes())
    dispatch(getEditorCompetition(competitionId))
    dispatch(getCities())
  }, [])

  useEffect(() => {
    setSortedSlides(competition.slides.sort((a, b) => (a.order > b.order ? 1 : -1)))
  }, [competition])

  /** Sets active slide ID and updates the state */
  const setActiveSlideId = (id: number) => {
    dispatch(setEditorSlideId(id))
    dispatch(getEditorCompetition(competitionId))
  }

  /** Creates API call to create a new slide in the database, and updates the state */
  const createNewSlide = async () => {
    await axios.post(`/api/competitions/${competitionId}/slides`, { title: 'Ny sida' })
    dispatch(getEditorCompetition(competitionId))
  }

  /** State used by the right-click context menu */
  const [contextState, setContextState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
    slideId: null | number
  }>(initialState)

  /** Shows context menu when right clicking a slide in the slide list */
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, slideId: number) => {
    event.preventDefault() //Prevents the standard browser context menu from opening
    setContextState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      slideId: slideId,
    })
  }

  /** Closes the context menu */
  const handleClose = () => {
    setContextState(initialState)
  }

  /** Creates API call to remove a slide from the database, updates the state, and closes the menu */
  const handleRemoveSlide = async () => {
    await axios.delete(`/api/competitions/${competitionId}/slides/${contextState.slideId}`)
    dispatch(getEditorCompetition(competitionId))
    setContextState(initialState)
  }

  /** Creates API call to duplicate a slide in the database, updates the state, and closes the menu */
  const handleDuplicateSlide = async () => {
    await axios.post(`/api/competitions/${competitionId}/slides/${contextState.slideId}/copy`)
    dispatch(getEditorCompetition(competitionId))
    setContextState(initialState)
  }

  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const [activeViewTypeName, setActiveViewTypeName] = useState('Audience')

  /** Changes active view type */
  const changeView = (clickedViewTypeName: string) => {
    setActiveViewTypeName(clickedViewTypeName)
    const clickedViewTypeId = viewTypes.find((viewType) => viewType.name === clickedViewTypeName)?.id
    if (clickedViewTypeId) {
      dispatch(setEditorViewId(clickedViewTypeId))
    }
    dispatch(getEditorCompetition(competitionId))
  }

  /** Changes slide order */
  const onDragEnd = async (result: DropResult) => {
    // if dropped outside the list or same place, do nothing
    if (!result.destination || result.destination.index === result.source.index) {
      return
    }
    const draggedIndex = result.source.index
    const draggedSlideId = sortedSlides[draggedIndex].id
    const slidesCopy = [...sortedSlides]
    const [removed] = slidesCopy.splice(draggedIndex, 1)
    slidesCopy.splice(result.destination.index, 0, removed)
    setSortedSlides(slidesCopy)
    if (draggedSlideId) {
      await axios
        .put(`/api/competitions/${competitionId}/slides/${draggedSlideId}`, { order: result.destination.index })
        .catch(console.log)
    }
  }
  return (
    <PresentationEditorContainer>
      <CssBaseline />
      {/** Top toolbar */}
      <AppBarEditor $leftDrawerWidth={leftDrawerWidth} $rightDrawerWidth={rightDrawerWidth} position="fixed">
        <ToolBarContainer>
          <Button component={Link} to="/admin/competition-manager" style={{ padding: 0 }}>
            <HomeIcon src="/t8.png" />
          </Button>
          <CompetitionName variant="h5" noWrap>
            {competition.name}
          </CompetitionName>

          <ButtonGroup color="secondary" variant="contained">
            <ViewButton
              $activeView={activeViewTypeName === 'Audience'}
              color="secondary"
              onClick={() => changeView('Audience')}
            >
              Åskådarvy
            </ViewButton>
            <ViewButton
              $activeView={activeViewTypeName === 'Team'}
              color="secondary"
              onClick={() => changeView('Team')}
            >
              Deltagarvy
            </ViewButton>
          </ButtonGroup>
        </ToolBarContainer>
      </AppBarEditor>
      {/** Left slide list */}
      <LeftDrawer $leftDrawerWidth={leftDrawerWidth} $rightDrawerWidth={undefined} variant="permanent" anchor="left">
        <FillLeftContainer $leftDrawerWidth={leftDrawerWidth} $rightDrawerWidth={undefined}>
          <ToolbarMargin />
          <SlideList>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {sortedSlides.map((slide, index) => (
                      <Draggable key={slide.id} draggableId={slide.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <SlideListItem
                              divider
                              key={slide.order}
                              button
                              selected={slide.id === activeSlideId}
                              onClick={() => setActiveSlideId(slide.id)}
                              onContextMenu={(event) => handleRightClick(event, slide.id)}
                            >
                              {renderSlideIcon(slide)}
                              <ListItemText primary={`Sida ${slide.order + 1}`} />
                            </SlideListItem>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </SlideList>
          <PositionBottom>
            <Divider />
            <SlideListItem divider button onClick={() => createNewSlide()}>
              <ListItemText primary="Ny sida" />
              <AddOutlinedIcon />
            </SlideListItem>
          </PositionBottom>
        </FillLeftContainer>
      </LeftDrawer>
      <ToolbarMargin />
      {/** Right settings panel */}
      <RightDrawer $leftDrawerWidth={undefined} $rightDrawerWidth={rightDrawerWidth} variant="permanent" anchor="right">
        <FillRightContainer $leftDrawerWidth={undefined} $rightDrawerWidth={rightDrawerWidth}>
          <RightPanelScroll>
            {!competitionLoading ? (
              <SettingsPanel />
            ) : (
              <CenteredSpinnerContainer>
                <CircularProgress />
              </CenteredSpinnerContainer>
            )}
          </RightPanelScroll>
        </FillRightContainer>
      </RightDrawer>

      <Content leftDrawerWidth={leftDrawerWidth} rightDrawerWidth={rightDrawerWidth}>
        <InnerContent>
          <SlideDisplay variant="editor" activeViewTypeId={activeViewTypeId} />
        </InnerContent>
      </Content>
      {/** Context menu which opens when right clicking a slide in the slide list */}
      <Menu
        keepMounted
        open={contextState.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextState.mouseY !== null && contextState.mouseX !== null
            ? { top: contextState.mouseY, left: contextState.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleDuplicateSlide}>Duplicera</MenuItem>
        <RemoveMenuItem onClick={handleRemoveSlide}>Ta bort</RemoveMenuItem>
      </Menu>
    </PresentationEditorContainer>
  )
}

export default PresentationEditorPage
