import { Button, Divider, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import { useParams } from 'react-router-dom'
import SettingsPanel from './components/SettingsPanel'
import './PresentationEditorPage.css'

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
    root: {
      display: 'flex',
    },
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

const PresentationEditorPage: React.FC = (props) => {
  const classes = useStyles()
  const params: CompetitionParams = useParams()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className="toolbar-container">
          <Typography variant="h6" noWrap>
            Tävling nr: {params.id}
          </Typography>
          <div className="view-button-group">
            <Button className="view-button" variant="contained" color="secondary">
              Åskådarvy
            </Button>
            <Button className="view-button" variant="contained" color="secondary">
              Deltagarvy
            </Button>
            <Button className="view-button" variant="contained" color="secondary">
              Domarvy
            </Button>
          </div>
        </Toolbar>
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
          {slides.map((slide, index) => (
            <ListItem className="slide-list-item" divider button key={slide.name}>
              <ListItemText primary={slide.name} />
            </ListItem>
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
    </div>
  )
}

export default PresentationEditorPage
