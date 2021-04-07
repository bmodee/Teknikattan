import { Tabs } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import React from 'react'
import CompetitionSettings from './CompetitionSettings'
import SlideSettings from './SlideSettings'
import { SettingsTab } from './styled'

interface TabPanelProps {
  activeTab: number
}

function TabContent(props: TabPanelProps) {
  const { activeTab } = props
  if (activeTab === 0) {
    return <CompetitionSettings />
  }
  return <SlideSettings />
}

const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(event, val) => setActiveTab(val)} aria-label="simple tabs example">
          <SettingsTab label="Tävling" />
          <SettingsTab label="Sida" />
        </Tabs>
      </AppBar>
      <TabContent activeTab={activeTab} />
    </div>
  )
}

export default SettingsPanel
