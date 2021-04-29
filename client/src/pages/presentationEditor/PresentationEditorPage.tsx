import { Button, ButtonGroup, CircularProgress, Divider, Menu, MenuItem } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import ListItemText from '@material-ui/core/ListItemText'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCities } from '../../actions/cities'
import { getEditorCompetition, setEditorSlideId, setEditorViewId } from '../../actions/editor'
import { getTypes } from '../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../hooks'
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

const PresentationEditorPage: React.FC = () => {
  const { competitionId }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const activeViewTypeId = useAppSelector((state) => state.editor.activeViewTypeId)
  const competition = useAppSelector((state) => state.editor.competition)
  const competitionLoading = useAppSelector((state) => state.editor.loading)
  useEffect(() => {
    dispatch(getTypes())
    dispatch(getEditorCompetition(competitionId))
    dispatch(getCities())
  }, [])

  const setActiveSlideId = (id: number) => {
    dispatch(setEditorSlideId(id))
  }

  const createNewSlide = async () => {
    await axios.post(`/api/competitions/${competitionId}/slides`, { title: 'Ny sida' })
    dispatch(getEditorCompetition(competitionId))
  }

  const [contextState, setContextState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
    slideId: null | number
  }>(initialState)

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, slideId: number) => {
    event.preventDefault()
    setContextState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      slideId: slideId,
    })
  }

  const handleClose = () => {
    setContextState(initialState)
  }

  const handleRemoveSlide = async () => {
    await axios.delete(`/api/competitions/${competitionId}/slides/${contextState.slideId}`)
    dispatch(getEditorCompetition(competitionId))
    setContextState(initialState)
  }

  const handleDuplicateSlide = async () => {
    await axios.post(`/api/competitions/${competitionId}/slides/${contextState.slideId}/copy`)
    dispatch(getEditorCompetition(competitionId))
    setContextState(initialState)
  }

  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const [activeViewTypeName, setActiveViewTypeName] = useState('Audience')
  const changeView = (clickedViewTypeName: string) => {
    setActiveViewTypeName(clickedViewTypeName)
    const clickedViewTypeId = viewTypes.find((viewType) => viewType.name === clickedViewTypeName)?.id
    if (clickedViewTypeId) {
      dispatch(setEditorViewId(clickedViewTypeId))
    }
  }

  return (
    <PresentationEditorContainer>
      <CssBaseline />
      <AppBarEditor $leftDrawerWidth={leftDrawerWidth} $rightDrawerWidth={rightDrawerWidth} position="fixed">
        <ToolBarContainer>
          <Button component={Link} to="/admin/tävlingshanterare" style={{ padding: 0 }}>
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
      <LeftDrawer $leftDrawerWidth={leftDrawerWidth} $rightDrawerWidth={undefined} variant="permanent" anchor="left">
        <FillLeftContainer $leftDrawerWidth={leftDrawerWidth} $rightDrawerWidth={undefined}>
          <ToolbarMargin />
          <SlideList>
            {competition.slides &&
              competition.slides.map((slide) => (
                <SlideListItem
                  divider
                  button
                  key={slide.id}
                  selected={slide.id === activeSlideId}
                  onClick={() => setActiveSlideId(slide.id)}
                  onContextMenu={(event) => handleRightClick(event, slide.id)}
                >
                  {renderSlideIcon(slide)}
                  <ListItemText primary={`Sida ${slide.order + 1}`} />
                </SlideListItem>
              ))}
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
