import { Button, CircularProgress, Divider, Menu, MenuItem, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCities } from '../../actions/cities'
import { getEditorCompetition, setEditorSlideId } from '../../actions/editor'
import { getTypes } from '../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { RichSlide } from '../../interfaces/ApiRichModels'
import { RemoveMenuItem } from '../admin/styledComp'
import { Content } from '../views/styled'
import SettingsPanel from './components/SettingsPanel'
import SlideEditor from './components/SlideEditor'
import {
  CenteredSpinnerContainer,
  HomeIcon,
  PresentationEditorContainer,
  SlideList,
  SlideListItem,
  ToolBarContainer,
  ViewButton,
  ViewButtonGroup,
} from './styled'

const initialState = {
  mouseX: null,
  mouseY: null,
  slideOrder: null,
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
  })
)

interface CompetitionParams {
  id: string
}

const PresentationEditorPage: React.FC = () => {
  const classes = useStyles()
  const { id }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const competition = useAppSelector((state) => state.editor.competition)
  const competitionLoading = useAppSelector((state) => state.editor.loading)
  // TODO: wait for dispatch to finish
  useEffect(() => {
    dispatch(getEditorCompetition(id))
    dispatch(getCities())
    dispatch(getTypes())
  }, [])

  const setActiveSlideId = (id: number) => {
    dispatch(setEditorSlideId(id))
  }

  const createNewSlide = async () => {
    await axios.post(`/competitions/${id}/slides`, { title: 'new slide' })
    dispatch(getEditorCompetition(id))
  }

  const [contextState, setContextState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
    slideOrder: null | number
  }>(initialState)

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, slideOrder: number) => {
    event.preventDefault()
    setContextState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      slideOrder: slideOrder,
    })
  }

  const handleClose = () => {
    setContextState(initialState)
  }

  const handleRemoveSlide = async () => {
    await axios.delete(`/competitions/${id}/slides/${contextState.slideOrder}`)
    dispatch(getEditorCompetition(id))
    setContextState(initialState)
  }

  const handleDuplicateSlide = async () => {
    await axios.post(`/competitions/${id}/slides/${contextState.slideOrder}/copy`)
    dispatch(getEditorCompetition(id))
    setContextState(initialState)
  }

  const renderSlideIcon = (slide: RichSlide) => {
    switch (slide.questions && slide.questions[0].type_id) {
      case 0:
        return <InfoOutlinedIcon></InfoOutlinedIcon> // information slide
      case 1:
        return <CreateOutlinedIcon></CreateOutlinedIcon> // text question
      case 2:
        return <BuildOutlinedIcon></BuildOutlinedIcon> // practical qustion
      case 3:
        return <DnsOutlinedIcon></DnsOutlinedIcon> // multiple choice question
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
            <ViewButton variant="contained" color="secondary">
              Åskådarvy
            </ViewButton>
            <ViewButton variant="contained" color="secondary">
              Deltagarvy
            </ViewButton>
            <ViewButton variant="contained" color="secondary">
              Domarvy
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
                  onContextMenu={(event) => handleRightClick(event, slide.order)}
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
        <SlideEditor />
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
