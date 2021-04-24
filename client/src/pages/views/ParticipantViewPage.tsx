import React, { useEffect } from 'react'
import SlideDisplay from './components/SlideDisplay'
import { useHistory } from 'react-router-dom'

const ParticipantViewPage: React.FC = () => {
  const history = useHistory()
  useEffect(() => {
    //hides the url so people can't sneak peak
    history.push('participant')
  }, [])
  return <SlideDisplay />
}

export default ParticipantViewPage
