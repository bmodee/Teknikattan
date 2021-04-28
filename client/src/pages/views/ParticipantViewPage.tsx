import React, { useEffect } from 'react'
import PresentationComponent from './components/PresentationComponent'
import { useHistory } from 'react-router-dom'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { ParticipantContainer } from './styled'
import { socketJoinPresentation, socket_connect } from '../../sockets'
import { useAppSelector } from '../../hooks'

const ParticipantViewPage: React.FC = () => {
  const history = useHistory()
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Participant')?.id
  useEffect(() => {
    //hides the url so people can't sneak peak
    history.push('participant')
    if (code && code !== '') {
      socket_connect()
      socketJoinPresentation()
    }
  }, [])
  return (
    <ParticipantContainer>
      {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
    </ParticipantContainer>
  )
}

export default ParticipantViewPage
