import { Typography } from '@material-ui/core'
import React from 'react'
import { RichQuestion } from '../../../interfaces/ApiRichModels'
import { JudgeScoringInstructionsContainer, ScoringInstructionsInner } from './styled'

type JudgeScoringInstructionsProps = {
  question: RichQuestion
}

const JudgeScoringInstructions = ({ question }: JudgeScoringInstructionsProps) => {
  console.log(question)
  return (
    <JudgeScoringInstructionsContainer elevation={3}>
      <ScoringInstructionsInner>
        <Typography variant="h4">Rättningsinstruktioner</Typography>
        <Typography variant="body1">
          {question?.correcting_instructions !== null
            ? question?.correcting_instructions
            : 'Det finns inga rättningsinstruktioner för denna fråga'}
        </Typography>
      </ScoringInstructionsInner>
    </JudgeScoringInstructionsContainer>
  )
}

export default JudgeScoringInstructions
