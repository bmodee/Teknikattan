/**
 * This file contains the page that redirects a user to the correct view when entered via a url with a code.
 */
import { CircularProgress, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { loginCompetition } from '../../actions/competitionLogin'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewSelectButtonGroup, ViewSelectContainer } from './styled'

interface ViewSelectParams {
  code: string
}
const ViewSelectPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const competitionId = useAppSelector((state) => state.competitionLogin.data?.competition_id)
  const errorMessage = useAppSelector((state) => state.competitionLogin.errors)
  const loading = useAppSelector((state) => state.competitionLogin.loading)
  const { code }: ViewSelectParams = useParams()
  const viewType = useAppSelector((state) => state.competitionLogin.data?.view)

  const renderView = () => {
    //Renders the correct view depending on view type
    if (competitionId && !errorMessage) {
      switch (viewType) {
        case 'Team':
          return <Redirect to={`/view/team`} />
        case 'Judge':
          return <Redirect to={`/view/judge`} />
        case 'Audience':
          return <Redirect to={`/view/audience`} />
        case 'Operator':
          return <Redirect to={`/view/operator`} />
        default:
          return (
            <ViewSelectContainer>
              <ViewSelectButtonGroup>
                <Typography variant="h4">Inkorrekt vy</Typography>
              </ViewSelectButtonGroup>
            </ViewSelectContainer>
          )
      }
    }
  }
  useEffect(() => {
    dispatch(loginCompetition(code, history, false))
  }, [])

  return (
    <>
      {renderView()}
      {(loading || errorMessage) && (
        <ViewSelectContainer>
          <ViewSelectButtonGroup>
            {loading && <CircularProgress />}
            {errorMessage && <Typography variant="h4">{errorMessage}</Typography>}
          </ViewSelectButtonGroup>
        </ViewSelectContainer>
      )}
    </>
  )
}

export default ViewSelectPage
