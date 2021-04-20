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
import React, { useEffect } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { getCities } from '../../actions/cities'
import { getRoles } from '../../actions/roles'
import { getTypes } from '../../actions/typesAction'
import { logoutUser } from '../../actions/user'
import { useAppDispatch, useAppSelector } from '../../hooks'
import CompetitionManager from './competitions/CompetitionManager'
import Dashboard from './dashboard/Dashboard'
import RegionManager from './regions/Regions'
import { LeftDrawer } from './styled'
import UserManager from './users/UserManager'
const drawerWidth = 250

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
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(35),
      paddingRight: theme.spacing(5),
    },
  })
)

const AdminView: React.FC = () => {
  const classes = useStyles()
  const [openIndex, setOpenIndex] = React.useState(0)
  const { path, url } = useRouteMatch()
  const currentUser = useAppSelector((state) => state.user.userInfo)
  const isAdmin = useAppSelector(
    (state) => state.roles.roles.find((x) => x.id === currentUser?.role_id)?.name === 'Admin'
  )
  const dispatch = useAppDispatch()
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  useEffect(() => {
    dispatch(getCities())
    dispatch(getRoles())
    dispatch(getTypes())
  }, [])

  const menuAdminItems = [
    { text: 'Startsida', icon: DashboardIcon },
    { text: 'Regioner', icon: LocationCityIcon },
    { text: 'Användare', icon: PeopleIcon },
    { text: 'Tävlingshanterare', icon: SettingsOverscanIcon },
  ]

  const menuEditorItems = [
    { text: 'Startsida', icon: DashboardIcon },
    { text: 'Tävlingshanterare', icon: SettingsOverscanIcon },
  ]

  const renderItems = () => {
    const menuItems = isAdmin ? menuAdminItems : menuEditorItems
    return menuItems.map((value, index) => (
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
    ))
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            {isAdmin ? menuAdminItems[openIndex].text : menuEditorItems[openIndex].text}
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
          <List>{renderItems()}</List>
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
            <Dashboard />
          </Route>
          <Route path={`${path}/regioner`}>
            <RegionManager />
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
