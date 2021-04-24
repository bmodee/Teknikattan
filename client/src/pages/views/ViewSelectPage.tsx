import Button from '@material-ui/core/Button'
import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { ViewSelectButtonGroup, ViewSelectContainer } from './styled'
import { useParams } from 'react-router-dom'
import { CircularProgress, Typography } from '@material-ui/core'
import ParticipantViewPage from './ParticipantViewPage'
import axios from 'axios'
import PresenterViewPage from './PresenterViewPage'
import JudgeViewPage from './JudgeViewPage'
import AudienceViewPage from './AudienceViewPage'
import { useAppSelector } from '../../hooks'

interface ViewSelectParams {
  code: string
}
const ViewSelectPage: React.FC = () => {
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
          return <ParticipantViewPage />
        case 'Judge':
          return <JudgeViewPage />
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
        setViewTypeId(response.data[0].view_type_id)
        setCompetitionId(response.data[0].competition_id)
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }, [])

  return (
    <ViewSelectContainer>
      <ViewSelectButtonGroup>
        {loading && <CircularProgress />}
        {!loading && renderView(viewTypeId)}
        {error && <Typography>Något gick fel, dubbelkolla koden och försök igen</Typography>}
      </ViewSelectButtonGroup>
    </ViewSelectContainer>
  )
}

export default ViewSelectPage
