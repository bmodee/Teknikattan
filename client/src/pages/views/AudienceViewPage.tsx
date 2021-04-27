import React from 'react'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import PresentationComponent from './components/PresentationComponent'
import mockedAxios from 'axios'

const AudienceViewPage: React.FC = () => {
  const res = {
    data: {},
  }
  ;(mockedAxios.get as jest.Mock).mockImplementation(() => {
    return Promise.resolve(res)
  })
  return <SlideDisplay />
}

export default AudienceViewPage
