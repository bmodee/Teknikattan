import { Tabs } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import React from 'react'
import CompetitionSettings from './CompetitionSettings'
import { SettingsTab } from './styled'

interface TabPanelProps {
  activeTab: number
}

function TabContent(props: TabPanelProps) {
  const { activeTab } = props
  if (activeTab === 0) {
    return <CompetitionSettings />
  } else if (activeTab === 1) {
    return <div>2</div>
  }
  return <div>3</div>
}

const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(event, val) => setActiveTab(val)} aria-label="simple tabs example">
          <SettingsTab label="Tävling" />
          <SettingsTab label="Sida" />
          <SettingsTab label="Stil" />
        </Tabs>
      </AppBar>
      <TabContent activeTab={activeTab} />
    </div>
  )
}

export default SettingsPanel
