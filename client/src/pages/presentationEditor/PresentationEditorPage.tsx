import { Button, Checkbox, CircularProgress, Divider, Menu, MenuItem, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import { CheckboxProps } from '@material-ui/core/Checkbox'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
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
  CenteredSpinnerContainer,
  HomeIcon,
  PresentationEditorContainer,
  SlideList,
  SlideListItem,
  ToolBarContainer,
  ViewButton,
  ViewButtonClicked,
  ViewButtonGroup,
} from './styled'

const initialState = {
  mouseX: null,
  mouseY: null,
  slideId: null,
}

const leftDrawerWidth = 150
const rightDrawerWidth = 390

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${rightDrawerWidth}px)`,
      marginLeft: leftDrawerWidth,
      marginRight: rightDrawerWidth,
    },
    leftDrawer: {
      width: leftDrawerWidth,
      flexShrink: 0,
      position: 'relative',
      zIndex: 1,
    },
    rightDrawer: {
      width: rightDrawerWidth,
      flexShrink: 0,
    },
    leftDrawerPaper: {
      width: leftDrawerWidth,
    },
    rightDrawerPaper: {
      width: rightDrawerWidth,
      background: '#EAEAEA',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
    alignCheckboxText: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 20,
    },
  })
)

interface CompetitionParams {
  competitionId: string
}

const PresentationEditorPage: React.FC = () => {
  const classes = useStyles()
  const { competitionId }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const activeViewTypeId = useAppSelector((state) => state.editor.activeViewTypeId)
  const competition = useAppSelector((state) => state.editor.competition)
  const competitionLoading = useAppSelector((state) => state.editor.loading)
  useEffect(() => {
    dispatch(getEditorCompetition(competitionId))
    dispatch(getCities())
    dispatch(getTypes())
  }, [])

  const setActiveSlideId = (id: number) => {
    dispatch(setEditorSlideId(id))
  }

  const createNewSlide = async () => {
    await axios.post(`/api/competitions/${competitionId}/slides`, { title: 'new slide' })
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

  const GreenCheckbox = withStyles({
    root: {
      color: '#FFFFFF',
      '&$checked': {
        color: '#FFFFFF',
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />)
  const [checkbox, setCheckbox] = useState(false)

  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const [activeViewTypeName, setActiveViewTypeName] = useState('')
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
      <AppBar position="fixed" className={classes.appBar}>
        <ToolBarContainer>
          <Button component={Link} to="/admin/tävlingshanterare" style={{ padding: 0 }}>
            <HomeIcon src="/t8.png" />
          </Button>
          <Typography variant="h6" noWrap>
            {competition.name}
          </Typography>

          <ViewButtonGroup>
            <GreenCheckbox checked={checkbox} onChange={(event) => setCheckbox(event.target.checked)} />
            <Typography className={classes.alignCheckboxText} variant="button">
              Applicera ändringar på samtliga vyer
            </Typography>
            <ViewButton
              activeView={activeViewTypeName === 'Audience'}
              variant="contained"
              color="secondary"
              onClick={() => changeView('Audience')}
            >
              Åskådarvy
            </ViewButton>
            <ViewButton
              activeView={activeViewTypeName === 'Team'}
              variant="contained"
              color="secondary"
              onClick={() => changeView('Team')}
            >
              Deltagarvy
            </ViewButton>
          </ViewButtonGroup>
        </ToolBarContainer>
      </AppBar>
      <Drawer
        className={classes.leftDrawer}
        variant="permanent"
        classes={{
          paper: classes.leftDrawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <SlideList>
          <div>
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
          </div>
          <div>
            <Divider />
            <SlideListItem divider button onClick={() => createNewSlide()}>
              <ListItemText primary="Ny sida" />
              <AddOutlinedIcon />
            </SlideListItem>
          </div>
        </SlideList>
      </Drawer>
      <div className={classes.toolbar} />
      <Drawer
        className={classes.rightDrawer}
        variant="permanent"
        classes={{
          paper: classes.rightDrawerPaper,
        }}
        anchor="right"
      >
        {!competitionLoading ? (
          <SettingsPanel />
        ) : (
          <CenteredSpinnerContainer>
            <CircularProgress />
          </CenteredSpinnerContainer>
        )}
      </Drawer>

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
