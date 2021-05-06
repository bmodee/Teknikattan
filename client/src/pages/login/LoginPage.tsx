/** This is the login page, it contains two child components, one is
 *   to log in as an admin, the other is to connect to a competition using a code
 */

import { AppBar, Tab, Tabs } from '@material-ui/core'
import React from 'react'
import AdminLogin from './components/AdminLogin'
import CompetitionLogin from './components/CompetitionLogin'
import { LoginPageContainer, LoginPaper } from './styled'

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

const LoginPage: React.FC = () => {
  const [loginTab, setLoginTab] = React.useState(0)
  return (
    <LoginPageContainer>
      <LoginPaper elevation={3}>
        <AppBar position="static">
          <Tabs value={loginTab} onChange={(event, selectedTab) => setLoginTab(selectedTab)}>
            <Tab label="Konto" id="simple-tab-0" />
            <Tab label="Tävling" id="simple-tab-1" />
          </Tabs>
        </AppBar>
        <LoginContent activeTab={loginTab} />
      </LoginPaper>
    </LoginPageContainer>
  )
}

export default LoginPage
