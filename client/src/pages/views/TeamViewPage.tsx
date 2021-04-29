import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getPresentationCompetition } from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewParams } from '../../interfaces/ViewParams'
import { socketConnect, socketJoinPresentation } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { PresentationBackground, PresentationContainer } from './styled'

const TeamViewPage: React.FC = () => {
  const history = useHistory()
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Team')?.id
  const { competitionId }: ViewParams = useParams()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getPresentationCompetition(competitionId))
    if (code && code !== '') {
      socketConnect()
      socketJoinPresentation()
    }
  }, [])
  return (
    <PresentationBackground>
      <PresentationContainer>
        {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
      </PresentationContainer>
    </PresentationBackground>
  )
}

export default TeamViewPage
