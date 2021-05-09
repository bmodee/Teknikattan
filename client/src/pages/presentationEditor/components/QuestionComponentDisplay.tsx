import { Card, Divider, ListItem, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../hooks'
import AnswerMultiple from './answerComponents/AnswerMultiple'
import AnswerSingle from './answerComponents/AnswerSingle'
import AnswerText from './answerComponents/AnswerText'
import { Center } from './styled'

type QuestionComponentProps = {
  variant: 'editor' | 'presentation'
  currentSlideId?: number
}

const QuestionComponentDisplay = ({ variant, currentSlideId }: QuestionComponentProps) => {
  const activeSlide = useAppSelector((state) => {
    if (variant === 'presentation' && currentSlideId)
      return state.presentation.competition.slides.find((slide) => slide.id === currentSlideId)
    if (variant === 'editor')
      return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)
    return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)
  })

  const timer = activeSlide?.timer
  const total_score = activeSlide?.questions[0].total_score
  const questionName = activeSlide?.questions[0].name

  const questionTypeId = activeSlide?.questions[0].type_id
  const questionTypeName = useAppSelector(
    (state) => state.types.questionTypes.find((qType) => qType.id === questionTypeId)?.name
  )

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

      default:
        break
    }
  }

  return (
    <Card style={{ maxHeight: '100%', overflowY: 'auto' }}>
      <ListItem>
        <Center style={{ justifyContent: 'space-evenly' }}>
          <Typography>Poäng: {total_score}</Typography>
          <Typography>{questionName}</Typography>
          <Typography>Timer: {timer}</Typography>
        </Center>
      </ListItem>
      <Divider />
      {getAlternatives()}
    </Card>
  )
}

export default QuestionComponentDisplay
