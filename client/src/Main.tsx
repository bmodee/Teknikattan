import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/login/LoginPage'
import PresentationEditorPage from './pages/presentationEditor/PresentationEditorPage'
import AudienceViewPage from './pages/views/AudienceViewPage'
import JudgeViewPage from './pages/views/JudgeViewPage'
import ParticipantViewPage from './pages/views/ParticipantViewPage'
import ViewSelectPage from './pages/views/ViewSelectPage'

const Main: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/editor/competition-id=:id" component={PresentationEditorPage} />
        <Route exact path="/view" component={ViewSelectPage} />
        <Route exact path="/view/participant" component={ParticipantViewPage} />
        <Route exact path="/view/judge" component={JudgeViewPage} />
        <Route exact path="/view/audience" component={AudienceViewPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Main
