import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../hooks'
import { AnswerContainer, ScoreDisplayContainer, ScoreDisplayHeader, ScoreInput } from './styled'

type ScoreDisplayProps = {
  teamIndex: number
}
const questionMaxScore = 5

const JudgeScoreDisplay = ({ teamIndex }: ScoreDisplayProps) => {
  const currentTeam = useAppSelector((state) => state.presentation.competition.teams[teamIndex])
  return (
    <ScoreDisplayContainer>
      <ScoreDisplayHeader>
        <Typography variant="h5">
          <Box fontWeight="fontWeightBold">{currentTeam.name}</Box>
        </Typography>

        <ScoreInput
          label="Poäng"
          defaultValue={0}
          inputProps={{ style: { fontSize: 20 } }}
          InputProps={{ disableUnderline: true, inputProps: { min: 0, max: questionMaxScore } }}
          type="number"
        ></ScoreInput>
      </ScoreDisplayHeader>
      <Typography variant="h6">Alla poäng: 2 0 0 0 0 0 0 0 0</Typography>
      <Typography variant="h6">Total poäng: 9</Typography>
      <AnswerContainer>
        <Typography variant="body1">
          Svar: blablablablablablablablablabla blablablablabla blablablablabla blablablablablablablablablabla{' '}
        </Typography>
      </AnswerContainer>
    </ScoreDisplayContainer>
  )
}

export default JudgeScoreDisplay
