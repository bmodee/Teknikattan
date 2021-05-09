import { Box, Typography } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { getPresentationCompetition } from '../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { RichSlide } from '../../../interfaces/ApiRichModels'
import { AnswerContainer, ScoreDisplayContainer, ScoreDisplayHeader, ScoreInput } from './styled'

type ScoreDisplayProps = {
  teamIndex: number
  activeSlide: RichSlide
}

const JudgeScoreDisplay = ({ teamIndex, activeSlide }: ScoreDisplayProps) => {
  const dispatch = useAppDispatch()
  const currentTeam = useAppSelector((state) => state.presentation.competition.teams[teamIndex])
  const currentCompetititonId = useAppSelector((state) => state.presentation.competition.id)
  const activeQuestion = activeSlide.questions[0]
  const scores = currentTeam.question_answers.map((questionAnswer) => questionAnswer.score)
  const questionMaxScore = activeQuestion?.total_score
  const activeAnswer = currentTeam.question_answers.find(
    (questionAnswer) => questionAnswer.question_id === activeQuestion?.id
  )
  const handleEditScore = async (newScore: number, answerId: number) => {
    await axios
      .put(`/api/competitions/${currentCompetititonId}/teams/${currentTeam.id}/answers/${answerId}`, {
        score: newScore,
      })
      .then(() => dispatch(getPresentationCompetition(currentCompetititonId.toString())))
  }

  return (
    <ScoreDisplayContainer>
      <ScoreDisplayHeader>
        <Typography variant="h5">
          <Box fontWeight="fontWeightBold">{currentTeam.name}</Box>
        </Typography>

        {activeAnswer && (
          <ScoreInput
            label="Poäng"
            defaultValue={activeAnswer?.score}
            inputProps={{ style: { fontSize: 20 } }}
            InputProps={{ disableUnderline: true, inputProps: { min: 0, max: questionMaxScore } }}
            type="number"
            onChange={(event) => handleEditScore(+event.target.value, activeAnswer.id)}
          />
        )}
      </ScoreDisplayHeader>
      <Typography variant="h6">Alla poäng: [ {scores.map((score) => `${score} `)}]</Typography>
      <Typography variant="h6">Total poäng: {scores.reduce((a, b) => a + b, 0)}</Typography>
      {activeAnswer && (
        <AnswerContainer>
          <Typography variant="body1">{activeAnswer.answer}</Typography>
        </AnswerContainer>
      )}
      {!activeAnswer && <Typography variant="body1">Inget svar</Typography>}
    </ScoreDisplayContainer>
  )
}

export default JudgeScoreDisplay
