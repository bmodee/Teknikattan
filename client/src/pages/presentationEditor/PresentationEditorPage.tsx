import { Button, CircularProgress, Divider, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCities } from '../../actions/cities'
import { getEditorCompetition, setEditorSlideId } from '../../actions/editor'
import { getTypes } from '../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { Content } from '../views/styled'
import SettingsPanel from './components/SettingsPanel'
import SlideEditor from './components/SlideEditor'
import {
  CenteredSpinnerContainer,
  HomeIcon,
  PresentationEditorContainer,
  SlideListItem,
  ToolBarContainer,
  ViewButton,
  ViewButtonGroup,
} from './styled'

function createSlide(name: string) {
  return { name }
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
        <List>
          {competition.slides &&
            competition.slides.map((slide) => (
              <SlideListItem
                divider
                button
                key={slide.id}
                selected={slide.id === activeSlideId}
                onClick={() => setActiveSlideId(slide.id)}
              >
                <ListItemText primary={slide.title} />
              </SlideListItem>
            ))}
        </List>
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
    </PresentationEditorContainer>
  )
}

export default PresentationEditorPage
