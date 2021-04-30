import React, { useEffect } from 'react'
import { useAppSelector } from '../../hooks'
import { socketConnect, socketJoinPresentation } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { PresentationBackground, PresentationContainer } from './styled'

const TeamViewPage: React.FC = () => {
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Team')?.id
  useEffect(() => {
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
