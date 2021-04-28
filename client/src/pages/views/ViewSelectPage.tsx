import Button from '@material-ui/core/Button'
import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { ViewSelectButtonGroup, ViewSelectContainer } from './styled'
import { useParams } from 'react-router-dom'
import { CircularProgress, Typography } from '@material-ui/core'
import TeamViewPage from './TeamViewPage'
import axios from 'axios'
import OperatorViewPage from './OperatorViewPage'
import JudgeViewPage from './JudgeViewPage'
import AudienceViewPage from './AudienceViewPage'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { getPresentationCompetition, setPresentationCode } from '../../actions/presentation'

interface ViewSelectParams {
  code: string
}
const ViewSelectPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [viewTypeId, setViewTypeId] = useState(undefined)
  const [competitionId, setCompetitionId] = useState<number | undefined>(undefined)
  const { code }: ViewSelectParams = useParams()
  const viewType = useAppSelector((state) => state.types.viewTypes.find((viewType) => viewType.id === viewTypeId)?.name)

  const renderView = (viewTypeId: number | undefined) => {
    //Renders the correct view depending on view type
    if (competitionId) {
      switch (viewType) {
        case 'Team':
          return <TeamViewPage />
        case 'Judge':
          return <JudgeViewPage code={code} competitionId={competitionId} />
        case 'Audience':
          return <AudienceViewPage />
        default:
          return <Typography>Inkorrekt vy</Typography>
      }
    }
  }

  useEffect(() => {
    axios
      .post('/api/auth/login/code', { code })
      .then((response) => {
        setLoading(false)
        setViewTypeId(response.data.view_type_id)
        setCompetitionId(response.data.competition_id)
        dispatch(getPresentationCompetition(response.data.competition_id))
        dispatch(setPresentationCode(code))
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }, [])

  return (
    <>
      {!loading && renderView(viewTypeId)}
      {(loading || error) && (
        <ViewSelectContainer>
          <ViewSelectButtonGroup>
            {loading && <CircularProgress />}
            {error && <Typography>Något gick fel, dubbelkolla koden och försök igen</Typography>}
          </ViewSelectButtonGroup>
        </ViewSelectContainer>
      )}
    </>
  )
}

export default ViewSelectPage
