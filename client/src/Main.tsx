import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getTypes } from './actions/typesAction'
import { useAppDispatch } from './hooks'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/login/LoginPage'
import PresentationEditorPage from './pages/presentationEditor/PresentationEditorPage'
import AudienceViewPage from './pages/views/AudienceViewPage'
import JudgeViewPage from './pages/views/JudgeViewPage'
import ParticipantViewPage from './pages/views/ParticipantViewPage'
import PresenterViewPage from './pages/views/PresenterViewPage'
import ViewSelectPage from './pages/views/ViewSelectPage'
import SecureRoute from './utils/SecureRoute'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getTypes())
  }, [])
  return (
    <BrowserRouter>
      <Switch>
        <SecureRoute login exact path="/" component={LoginPage} />
        <SecureRoute path="/admin" component={AdminPage} />
        <SecureRoute path="/editor/competition-id=:id" component={PresentationEditorPage} />
        <Route exact path="/:code" component={ViewSelectPage} />
        <Route exact path="/participant/id=:id&code=:code" component={ParticipantViewPage} />
        <SecureRoute exact path="/presenter/id=:id&code=:code" component={PresenterViewPage} />
        <Route exact path="/judge/id=:id&code=:code" component={JudgeViewPage} />
        <Route exact path="/audience/id=:id&code=:code" component={AudienceViewPage} />
      </Switch>
    </BrowserRouter>
  )
}
export default Main
