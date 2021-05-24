/**
 * What it is:
 * This file contains the question component function which returns the question component.
 * This component is used for displaying a question component for the participants with correct type of answer alternatives to interact with
 * (see the function getAlternatives).
 *
 * How it's used:
 * This file is used when a question component is to be displayed which happens in RndComponent.tsx for rendering in the editor
 * and PresentationComponent.tsx for rendering in the presentation (the actual competition).
 *
 * @module
 */

import { AppBar, Card, Divider, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../hooks'
import AnswerMatch from './answerComponents/AnswerMatch'
import AnswerMultiple from './answerComponents/AnswerMultiple'
import AnswerSingle from './answerComponents/AnswerSingle'
import AnswerText from './answerComponents/AnswerText'
import { Center } from './styled'

type QuestionComponentProps = {
  variant: 'editor' | 'presentation'
  currentSlideId?: number
}

/** Creates and renders a question component */
const QuestionComponentDisplay = ({ variant, currentSlideId }: QuestionComponentProps) => {
  /** Gets the slide from the relevant state (presentation or editor) */
  const activeSlide = useAppSelector((state) => {
    if (variant === 'presentation' && currentSlideId)
      return state.presentation.competition.slides.find((slide) => slide.id === currentSlideId)
    if (variant === 'editor')
      return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)
    return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)
  })

  const timer = activeSlide?.timer
  const total_score = activeSlide?.questions[0].total_score //[0] is because each slide can only have one question currently.
  const questionName = activeSlide?.questions[0].name

  const questionTypeId = activeSlide?.questions[0].type_id
  const questionTypeName = useAppSelector(
    (state) => state.types.questionTypes.find((qType) => qType.id === questionTypeId)?.name
  )

  /**
   * This function is used for displaying the correct answer alternatives which is the part of the question component
   * which the participants will interact with to submit their answers.
   */
  const getAlternatives = () => {
    switch (questionTypeName) {
      case 'Text':
        if (activeSlide) {
          return <AnswerText activeSlide={activeSlide} competitionId={activeSlide.competition_id.toString()} />
        }
        return

      case 'Practical':
        return

      case 'Multiple':
        if (activeSlide) {
          return (
            <AnswerMultiple
              variant={variant}
              activeSlide={activeSlide}
              competitionId={activeSlide.competition_id.toString()}
            />
          )
        }
        return

      case 'Single':
        if (activeSlide) {
          return (
            <AnswerSingle
              variant={variant}
              activeSlide={activeSlide}
              competitionId={activeSlide.competition_id.toString()}
            />
          )
        }
        return
      case 'Match':
        if (activeSlide) {
          return (
            <AnswerMatch
              variant={variant}
              activeSlide={activeSlide}
              competitionId={activeSlide.competition_id.toString()}
            />
          )
        }
        return
      default:
        break
    }
  }

  return (
    <Card elevation={4} style={{ maxHeight: '100%', overflowY: 'auto' }}>
      <AppBar position="relative">
        <div style={{ display: 'flex', height: 60 }}>
          <Center style={{ alignItems: 'center' }}>
            <Typography variant="h5">{questionName}</Typography>
          </Center>
        </div>
        <div style={{ position: 'fixed', right: 5, top: 14, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5">{total_score}p</Typography>
        </div>
      </AppBar>
      <Divider />
      {getAlternatives() /*This displays the actual alternatives for the question*/}
    </Card>
  )
}

export default QuestionComponentDisplay
