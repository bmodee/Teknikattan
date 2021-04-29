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
  const errorMessage = useAppSelector((state) => state.competitionLogin.errors?.message)
  const loading = useAppSelector((state) => state.competitionLogin.loading)
  const { code }: ViewSelectParams = useParams()
  const viewType = useAppSelector((state) => state.competitionLogin.data?.view)

  const renderView = () => {
    //Renders the correct view depending on view type
    if (competitionId) {
      switch (viewType) {
        case 'Team':
          return <Redirect to={`/team/competition-id=${competitionId}`} />
        case 'Judge':
          return <Redirect to={`/judge/competition-id=${competitionId}`} />
        case 'Audience':
          return <Redirect to={`/audience/competition-id=${competitionId}`} />
        case 'Operator':
          return <Redirect to={`/operator/competition-id=${competitionId}`} />
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
