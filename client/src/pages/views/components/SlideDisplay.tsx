import { Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../hooks'
import { SlideContainer } from './styled'

const SlideDisplay: React.FC = () => {
  const currentSlide = useAppSelector((state) => state.presentation.slide)
  return (
    <SlideContainer>
      <Typography variant="h3">{currentSlide.title}</Typography>
    </SlideContainer>
  )
}

export default SlideDisplay
