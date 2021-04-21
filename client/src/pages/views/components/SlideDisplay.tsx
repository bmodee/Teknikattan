import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { SlideContainer } from './styled'

const SlideDisplay: React.FC = () => {
  const currentSlide = useAppSelector((state) => state.presentation.slide)
  const dispatch = useAppDispatch()
  useEffect(() => {}, [])

  return (
    <div>
      <SlideContainer>
        <Typography variant="h3">Slide Title: {currentSlide.title} </Typography>
        <Typography variant="h3">Timer: {currentSlide.timer} </Typography>
        <Typography variant="h3">Slide ID: {currentSlide.id} </Typography>
      </SlideContainer>
    </div>
  )
}

export default SlideDisplay
