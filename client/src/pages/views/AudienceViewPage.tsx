import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPresentationCompetition } from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewParams } from '../../interfaces/ViewParams'
import { socketConnect, socketJoinPresentation } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { PresentationBackground, PresentationContainer } from './styled'

const AudienceViewPage: React.FC = () => {
  const { competitionId }: ViewParams = useParams()
  const code = useAppSelector((state) => state.presentation.code)
  const dispatch = useAppDispatch()
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  useEffect(() => {
    dispatch(getPresentationCompetition(competitionId))
    if (code && code !== '') {
      socketConnect()
      socketJoinPresentation()
    }
  }, [])
  if (activeViewTypeId) {
    return (
      <PresentationBackground>
        <PresentationContainer>
          <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />
        </PresentationContainer>
      </PresentationBackground>
    )
  }
  return <Typography>Error: Åskådarvyn kunde inte laddas</Typography>
}

export default AudienceViewPage
