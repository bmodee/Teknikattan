import { Divider, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Content } from '../views/styled'
import SettingsPanel from './components/SettingsPanel'
import SlideEditor from './components/SlideEditor'
import { PresentationEditorContainer, SlideListItem, ToolBarContainer, ViewButton, ViewButtonGroup } from './styled'

function createSlide(name: string) {
  return { name }
}

const slides = [
  createSlide('Sida 1'),
  createSlide('Sida 2'),
  createSlide('Sida 3'),
  createSlide('Sida 4'),
  createSlide('Sida 5'),
  createSlide('Sida 6'),
  createSlide('Sida 7'),
]
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
  const params: CompetitionParams = useParams()
  return (
    <PresentationEditorContainer>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <ToolBarContainer>
          <Typography variant="h6" noWrap>
            Tävling nr: {params.id}
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
          {slides.map((slide) => (
            <SlideListItem divider button key={slide.name}>
              <ListItemText primary={slide.name} />
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
        <SettingsPanel></SettingsPanel>
      </Drawer>

      <Content leftDrawerWidth={leftDrawerWidth} rightDrawerWidth={rightDrawerWidth}>
        <SlideEditor />
      </Content>
    </PresentationEditorContainer>
  )
}

export default PresentationEditorPage
