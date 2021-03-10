import { AppBar, Tab, Tabs } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import AdminLogin from './components/AdminLogin'
import CompetitionLogin from './components/CompetitionLogin'
import './LoginPage.css'

interface TabPanelProps {
  activeTab: number
}

function LoginContent(props: TabPanelProps) {
  const { activeTab } = props
  if (activeTab === 0) {
    return <AdminLogin />
  }
  return <CompetitionLogin />
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))

const LoginPage: React.FC = () => {
  const classes = useStyles()
  const [loginTab, setLoginTab] = React.useState(0)
  return (
    <div className="login-page">
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={loginTab} onChange={(event, selectedTab) => setLoginTab(selectedTab)}>
            <Tab label="Konto" id="simple-tab-0" />
            <Tab label="Tävling" id="simple-tab-1" />
          </Tabs>
        </AppBar>
        <LoginContent activeTab={loginTab} />
      </div>
    </div>
  )
}

export default LoginPage
