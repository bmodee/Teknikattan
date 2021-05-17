import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { socketConnect } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { OperatorContainer, OperatorHeader, PresentationBackground, PresentationContainer } from './styled'

const TeamViewPage: React.FC = () => {
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Team')?.id
  const [successMessageOpen, setSuccessMessageOpen] = useState(true)
  const competitionName = useAppSelector((state) => state.presentation.competition.name)
  const presentation = useAppSelector((state) => state.presentation)
  const activeSlideOrder = useAppSelector(
    (state) =>
      state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)?.order
  )
  const teamName = useAppSelector(
    (state) =>
      state.presentation.competition.teams.find((team) => team.id === state.competitionLogin.data?.team_id)?.name
  )
  useEffect(() => {
    if (code && code !== '') {
      socketConnect('Team')
    }
  }, [])
  return (
    <OperatorContainer>
      <OperatorHeader></OperatorHeader>
      <PresentationBackground>
        <PresentationContainer>
          {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
        </PresentationContainer>
        <Snackbar open={successMessageOpen} autoHideDuration={4000} onClose={() => setSuccessMessageOpen(false)}>
          <Alert severity="success">{`Du har gått med i tävlingen "${competitionName}" som lag ${teamName}`}</Alert>
        </Snackbar>
      </PresentationBackground>
    </OperatorContainer>
  )
}

export default TeamViewPage
