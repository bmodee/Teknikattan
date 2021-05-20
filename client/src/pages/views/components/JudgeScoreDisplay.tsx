import { Box, Card, Divider, Typography } from '@material-ui/core'
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
  UnderlinedTypography,
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

  const questions = useAppSelector((state) => state.presentation.competition.slides.map((slide) => slide.questions[0]))
  const teamScores = [...currentTeam.question_scores.map((score) => score)]
  const scores: (number | undefined)[] = []
  for (const question of questions) {
    const correctTeamScore = teamScores.find((score) => question && score.question_id === question.id)
    if (correctTeamScore !== undefined) {
      scores.push(correctTeamScore.score)
    } else scores.push(undefined)
  }
  const handleEditScore = async (newScore: number, questionId: number) => {
    await axios
      .put(`/api/competitions/${currentCompetititonId}/teams/${currentTeam.id}/answers/question_scores/${questionId}`, {
        score: newScore,
      })
      .then(() => dispatch(getPresentationCompetition(currentCompetititonId.toString())))
  }

  const sumTwoScores = (a: number | undefined, b: number | undefined) => {
    let aValue = 0
    let bValue = 0
    aValue = a ? a : 0
    bValue = b ? b : 0
    return aValue + bValue
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
      if (activeQuestion.type_id === 1 || activeQuestion.type_id === 5) {
        // Text question or match question
        result.push(ans.answer)
      } else if (+ans.answer > 0) {
        result.push(alt.alternative)
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
      // Match question
      if (activeQuestion.type_id === 5) {
        result.push(`${alt.alternative} - ${alt.correct}`)
      } else if (activeQuestion.type_id !== 1 && +alt.correct > 0) {
        // Not text question and correct answer
        result.push(alt.alternative)
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
            InputProps={{ disableUnderline: true, inputProps: { min: 0 } }}
            type="number"
            onChange={(event) => handleEditScore(+event.target.value, activeQuestion.id)}
          />
        )}
      </ScoreDisplayHeader>
      <Typography variant="h6">
        Sidor:
        <div style={{ display: 'flex' }}>
          {questions.map((question, index) => (
            <Card
              key={index}
              elevation={2}
              style={{
                width: 25,
                height: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              {index + 1}
            </Card>
          ))}
        </div>
        Poäng:
        <div style={{ display: 'flex' }}>
          {scores.map((score, index) => (
            <Card
              key={index}
              elevation={2}
              style={{
                width: 25,
                height: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              {questions[index] ? score : '-'}
            </Card>
          ))}
        </div>
        Total poäng: {scores.reduce((a, b) => sumTwoScores(a, b), 0)}
      </Typography>
      <AnswersDisplay>
        <Answers>
          <Divider />
          <UnderlinedTypography variant="body1">Lagets svar:</UnderlinedTypography>
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
          {activeQuestion && activeQuestion.type_id !== 1 && (
            <UnderlinedTypography variant="body1">Korrekta svar:</UnderlinedTypography>
          )}
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
