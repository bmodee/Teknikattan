import { Box, Card, Typography } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { getPresentationCompetition } from '../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { RichQuestion } from '../../../interfaces/ApiRichModels'
import {
  AnswerContainer,
  JudgeScoringInstructionsContainer,
  ScoreDisplayContainer,
  ScoreDisplayHeader,
  ScoreInput,
} from './styled'

type JudgeScoringInstructionsProps = {
  question: RichQuestion
}

const JudgeScoringInstructions = ({ question }: JudgeScoringInstructionsProps) => {
  return (
    <JudgeScoringInstructionsContainer elevation={3}>
      <Typography variant="h4">Rättningsinstruktioner</Typography>
      <Typography variant="body1">{question?.correcting_instructions}</Typography>
    </JudgeScoringInstructionsContainer>
  )
}

export default JudgeScoringInstructions
