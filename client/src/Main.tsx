import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getTypes } from './actions/typesAction'
import { useAppDispatch } from './hooks'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/login/LoginPage'
import PresentationEditorPage from './pages/presentationEditor/PresentationEditorPage'
import AudienceViewPage from './pages/views/AudienceViewPage'
import JudgeViewPage from './pages/views/JudgeViewPage'
import OperatorViewPage from './pages/views/OperatorViewPage'
import TeamViewPage from './pages/views/TeamViewPage'
import ViewSelectPage from './pages/views/ViewSelectPage'
import SecureRoute from './utils/SecureRoute'

/**
 * This is the main function
 *
 * @returns jsx - All the routes
 */
const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getTypes())
  }, [])
  return (
    <BrowserRouter>
      <Switch>
        <SecureRoute authLevel="login" exact path="/" component={LoginPage} />
        <SecureRoute authLevel="admin" path="/admin" component={AdminPage} />
        <SecureRoute
          authLevel="admin"
          path="/editor/competition-id=:competitionId"
          component={PresentationEditorPage}
        />
        <Route exact path="/:code" component={ViewSelectPage} />
        <SecureRoute authLevel="Team" exact path="/view/team" component={TeamViewPage} />
        <SecureRoute authLevel="Operator" exact path="/view/operator" component={OperatorViewPage} />
        <SecureRoute authLevel="Judge" exact path="/view/judge" component={JudgeViewPage} />
        <SecureRoute authLevel="Audience" exact path="/view/audience" component={AudienceViewPage} />
      </Switch>
    </BrowserRouter>
  )
}
export default Main
