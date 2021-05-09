import { Snackbar, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { socketConnect, socketJoinPresentation } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { PresentationBackground, PresentationContainer } from './styled'

const AudienceViewPage: React.FC = () => {
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  const [successMessageOpen, setSuccessMessageOpen] = useState(true)
  const competitionName = useAppSelector((state) => state.presentation.competition.name)
  useEffect(() => {
    if (code && code !== '') {
      socketConnect('Audience')
      socketJoinPresentation()
    }
  }, [])
  if (activeViewTypeId) {
    return (
      <PresentationBackground>
        <PresentationContainer>
          <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />
        </PresentationContainer>
        <Snackbar open={successMessageOpen} autoHideDuration={4000} onClose={() => setSuccessMessageOpen(false)}>
          <Alert severity="success">{`Du har gått med i tävlingen "${competitionName}" som åskådare`}</Alert>
        </Snackbar>
      </PresentationBackground>
    )
  }
  return <Typography>Error: Åskådarvyn kunde inte laddas</Typography>
}

export default AudienceViewPage
