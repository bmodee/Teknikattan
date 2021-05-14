import { Snackbar, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { socketConnect, socketJoinPresentation } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import Timer from '../views/components/Timer'
import {
  OperatorContainer,
  OperatorHeader,
  OperatorHeaderItem,
  PresentationBackground,
  PresentationContainer,
} from './styled'

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
      socketJoinPresentation()
    }
  }, [])
  return (
    <OperatorContainer>
      <OperatorHeader>
        <Typography variant="h1">
          <Timer />
        </Typography>
        <OperatorHeaderItem>
          <Typography variant="h3">
            {activeSlideOrder !== undefined && activeSlideOrder + 1} / {presentation.competition.slides.length}
          </Typography>
        </OperatorHeaderItem>
      </OperatorHeader>
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
