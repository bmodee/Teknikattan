/**
 * This file contains the view that is to be shown for the audience watching the competition.
 */
import { Snackbar, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { socketConnect } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import Scoreboard from './components/Scoreboard'
import { PresentationBackground, PresentationContainer } from './styled'

/** Connects a device to a competition and renders out the correct components for the audience viewType */
const AudienceViewPage: React.FC = () => {
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  const [successMessageOpen, setSuccessMessageOpen] = useState(true)
  const competitionName = useAppSelector((state) => state.presentation.competition.name)
  const showScoreboard = useAppSelector((state) => state.presentation.show_scoreboard)

  useEffect(() => {
    /** Connect as audience */
    if (code && code !== '') {
      socketConnect('Audience')
    }
  }, [])
  if (activeViewTypeId) {
    return (
      <PresentationBackground>
        <PresentationContainer>
          <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />
        </PresentationContainer>
        {/** Confirm that the connection was successful */}
        <Snackbar open={successMessageOpen} autoHideDuration={4000} onClose={() => setSuccessMessageOpen(false)}>
          <Alert severity="success">{`Du har gått med i tävlingen "${competitionName}" som åskådare`}</Alert>
        </Snackbar>
        {showScoreboard && <Scoreboard />}
      </PresentationBackground>
    )
  }
  return <Typography>Error: Åskådarvyn kunde inte laddas</Typography>
}

export default AudienceViewPage
