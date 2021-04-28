import React, { useEffect } from 'react'
import PresentationComponent from './components/PresentationComponent'
import { useHistory } from 'react-router-dom'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { TeamContainer } from './styled'
import { socketJoinPresentation, socket_connect } from '../../sockets'
import { useAppSelector } from '../../hooks'

const TeamViewPage: React.FC = () => {
  const history = useHistory()
  const code = useAppSelector((state) => state.presentation.code)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Team')?.id
  useEffect(() => {
    //hides the url so people can't sneak peak
    history.push('team')
    if (code && code !== '') {
      socket_connect()
      socketJoinPresentation()
    }
  }, [])
  return (
    <TeamContainer>
      {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
    </TeamContainer>
  )
}

export default TeamViewPage
