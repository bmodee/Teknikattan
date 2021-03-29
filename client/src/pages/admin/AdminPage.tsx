import {
  AppBar,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DashboardIcon from '@material-ui/icons/Dashboard'
import MailIcon from '@material-ui/icons/Mail'
import React from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import CompetitionManager from './components/CompetitionManager'
import Regions from './components/Regions'

const drawerWidth = 240
const menuItems = ['Startsida', 'Regioner', 'Användare', 'Tävlingshanterare']

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      marginRight: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      paddingLeft: theme.spacing(30),
    },
  })
)

const AdminView: React.FC = () => {
  const classes = useStyles()
  const [openIndex, setOpenIndex] = React.useState(0)
  const { path, url } = useRouteMatch()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            {menuItems[openIndex]}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={(classes.drawer, 'background')}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div>
          <div className={classes.toolbar} />
          <Divider />
          <List>
            {menuItems.map((text, index) => (
              <ListItem
                button
                component={Link}
                key={text}
                to={`${url}/${text.toLowerCase()}`}
                selected={index === openIndex}
                onClick={() => setOpenIndex(index)}
              >
                <ListItemIcon>{index === 0 ? <DashboardIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <Button component={Link} to="/" type="submit" fullWidth variant="contained" color="primary">
                Logga ut
              </Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path={[path, `${path}/startsida`]}>
            <Typography variant="h1" noWrap>
              Startsida
            </Typography>
          </Route>
          <Route path={`${path}/regioner`}>
            <Regions />
          </Route>
          <Route path={`${path}/användare`}>
            <Typography variant="h1" noWrap>
              Användare
            </Typography>
          </Route>
          <Route path={`${path}/tävlingshanterare`}>
            <CompetitionManager />
          </Route>
        </Switch>
      </main>
    </div>
  )
}

export default AdminView
