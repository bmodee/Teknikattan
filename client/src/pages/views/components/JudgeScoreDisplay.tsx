import { Box, Divider, Typography } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { getPresentationCompetition } from '../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { RichSlide } from '../../../interfaces/ApiRichModels'
import {
  AnswerContainer,
  Answers,
  AnswersDisplay,
  ScoreDisplayContainer,
  ScoreDisplayHeader,
  ScoreInput,
} from './styled'

type ScoreDisplayProps = {
  teamIndex: number
  activeSlide: RichSlide
}

const JudgeScoreDisplay = ({ teamIndex, activeSlide }: ScoreDisplayProps) => {
  const dispatch = useAppDispatch()
  const currentTeam = useAppSelector((state) => state.presentation.competition.teams[teamIndex])
  const currentCompetititonId = useAppSelector((state) => state.presentation.competition.id)

  const activeQuestion = activeSlide.questions[0]
  const activeScore = currentTeam.question_scores.find((x) => x.question_id === activeQuestion?.id)
  const questionMaxScore = activeQuestion?.total_score

  const scores = currentTeam.question_scores.map((questionAnswer) => questionAnswer.score)
  const handleEditScore = async (newScore: number, questionId: number) => {
    await axios
      .put(`/api/competitions/${currentCompetititonId}/teams/${currentTeam.id}/answers/question_scores/${questionId}`, {
        score: newScore,
      })
      .then(() => dispatch(getPresentationCompetition(currentCompetititonId.toString())))
  }

  const getAnswers = () => {
    const result: string[] = []
    if (!activeQuestion) {
      return result
    }
    for (const alt of activeQuestion.alternatives) {
      const ans = currentTeam.question_alternative_answers.find((x) => x.question_alternative_id === alt.id)
      if (!ans) {
        continue
      }
      if (activeQuestion.type_id === 1) {
        // Text question
        result.push(ans.answer)
      } else if (+ans.answer > 0) {
        result.push(alt.text)
      }
    }
    return result
  }

  const getAlternatives = () => {
    const result: string[] = []
    if (!activeQuestion) {
      return result
    }
    for (const alt of activeQuestion.alternatives) {
      if (activeQuestion.type_id !== 1 && +alt.value > 0) {
        // Not text question and correct answer
        result.push(alt.text)
      }
    }
    return result
  }

  return (
    <ScoreDisplayContainer>
      <ScoreDisplayHeader>
        <Typography variant="h5">
          <Box fontWeight="fontWeightBold">{currentTeam.name}</Box>
        </Typography>

        {activeQuestion && (
          <ScoreInput
            label="Poäng"
            defaultValue={0}
            value={activeScore ? activeScore.score : 0}
            inputProps={{ style: { fontSize: 20 } }}
            InputProps={{ disableUnderline: true, inputProps: { min: 0, max: questionMaxScore } }}
            type="number"
            onChange={(event) => handleEditScore(+event.target.value, activeQuestion.id)}
          />
        )}
      </ScoreDisplayHeader>
      <Typography variant="h6">Alla poäng: [ {scores.map((score) => `${score} `)}]</Typography>
      <Typography variant="h6">Total poäng: {scores.reduce((a, b) => a + b, 0)}</Typography>

      <AnswersDisplay>
        <Answers>
          <Divider />
          <Typography variant="body1">Lagets svar:</Typography>
          {activeQuestion && (
            <AnswerContainer>
              {getAnswers().map((v, k) => (
                <Typography variant="body1" key={k}>
                  <span>&#8226;</span> {v}
                </Typography>
              ))}
            </AnswerContainer>
          )}
        </Answers>

        <Answers>
          <Divider />
          <Typography variant="body1">Korrekta svar:</Typography>
          {activeQuestion && (
            <AnswerContainer>
              {getAlternatives().map((v, k) => (
                <Typography variant="body1" key={k}>
                  <span>&#8226;</span> {v}
                </Typography>
              ))}
            </AnswerContainer>
          )}
        </Answers>
      </AnswersDisplay>

      {!activeQuestion && <Typography variant="body1">Inget svar</Typography>}
    </ScoreDisplayContainer>
  )
}

export default JudgeScoreDisplay
