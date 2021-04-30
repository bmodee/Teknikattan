import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useAppSelector } from '../../hooks'
import { socketConnect, socketJoinPresentation } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { PresentationBackground, PresentationContainer } from './styled'

const AudienceViewPage: React.FC = () => {
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  useEffect(() => {
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
