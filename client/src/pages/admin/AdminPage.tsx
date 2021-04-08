import {
  AppBar,
  Button,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import PeopleIcon from '@material-ui/icons/People'
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan'
import React from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { logoutUser } from '../../actions/user'
import { useAppDispatch } from '../../hooks'
import CompetitionManager from './components/CompetitionManager'
import Regions from './components/Regions'
import UserManager from './components/UserManager'
import { LeftDrawer } from './styled'
const drawerWidth = 250
const menuItems = [
  { text: 'Startsida', icon: DashboardIcon },
  { text: 'Regioner', icon: LocationCityIcon },
  { text: 'Användare', icon: PeopleIcon },
  { text: 'Tävlingshanterare', icon: SettingsOverscanIcon },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: '100%',
      marginLeft: drawerWidth,
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
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  const dispatch = useAppDispatch()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            {menuItems[openIndex].text}
          </Typography>
        </Toolbar>
      </AppBar>
      <LeftDrawer
        width={drawerWidth}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
        anchor="left"
      >
        <div>
          <div className={classes.toolbar} />
          <Divider />
          <List>
            {menuItems.map((value, index) => (
              <ListItem
                button
                component={Link}
                key={value.text}
                to={`${url}/${value.text.toLowerCase()}`}
                selected={index === openIndex}
                onClick={() => setOpenIndex(index)}
              >
                <ListItemIcon>{React.createElement(value.icon)}</ListItemIcon>
                <ListItemText primary={value.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <Button
                onClick={handleLogout}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                endIcon={<ExitToAppIcon></ExitToAppIcon>}
              >
                Logga ut
              </Button>
            </ListItem>
          </List>
        </div>
      </LeftDrawer>
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
            <UserManager />
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
