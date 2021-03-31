import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/login/LoginPage'
import PresentationEditorPage from './pages/presentationEditor/PresentationEditorPage'
import AudienceViewPage from './pages/views/AudienceViewPage'
import JudgeViewPage from './pages/views/JudgeViewPage'
import ParticipantViewPage from './pages/views/ParticipantViewPage'
import ViewSelectPage from './pages/views/ViewSelectPage'
import SecureRoute from './utils/SecureRoute'

const Main: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <SecureRoute login exact path="/" component={LoginPage} />
        <SecureRoute path="/admin" component={AdminPage} />
        <SecureRoute path="/editor/competition-id=:id" component={PresentationEditorPage} />
        <Route exact path="/view" component={ViewSelectPage} />
        <Route exact path="/view/participant" component={ParticipantViewPage} />
        <Route exact path="/view/judge" component={JudgeViewPage} />
        <Route exact path="/view/audience" component={AudienceViewPage} />
      </Switch>
    </BrowserRouter>
  )
}
export default Main
