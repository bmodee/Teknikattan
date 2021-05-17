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
  const questionTypes = useAppSelector((state) => state.types.questionTypes)
  const currentTeam = useAppSelector((state) => state.presentation.competition.teams[teamIndex])
  const currentCompetititonId = useAppSelector((state) => state.presentation.competition.id)

  const activeQuestion = activeSlide.questions[0]
  const activeScore = currentTeam.question_scores.find((x) => x.question_id === activeQuestion?.id)
  const questionMaxScore = activeQuestion?.total_score

  const scores = currentTeam.question_scores.map((questionAnswer) => questionAnswer.score)
  const textQuestionType = questionTypes.find((questionType) => questionType.name === 'Text')?.id || 0
  const handleEditScore = async (newScore: number, questionId: number) => {
    await axios
      .put(`/api/competitions/${currentCompetititonId}/teams/${currentTeam.id}/answers/question_scores/${questionId}`, {
        score: newScore,
      })
      .then(() => dispatch(getPresentationCompetition(currentCompetititonId.toString())))
  }

  const getAlternativeAnswers = () => {
    const result: string[] = []
    if (!activeQuestion) {
      return result
    }

    for (const alt of activeQuestion.alternatives) {
      const value = currentTeam.question_alternative_answers.find((x) => x.question_alternative_id === alt.id)
      if (!value) {
        continue
      }
      if (activeQuestion.type_id === 1) {
        result.push(alt.text)
      } else if (+value.answer > 0) {
        result.push(alt.text)
      }
      /*
      switch(activeQuestion.question_type.name){
        case "Text":
          result.push(alt.text)
          break;
        default:
      }*/
    }

    return result
    //const asdasd = currentTeam.question_alternative_answers.filter((x)=>x.question_alternative_id === activeQuestion.alternatives[0].io)
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
      {activeQuestion && (
        <AnswerContainer>
          {getAlternativeAnswers().map((v, k) => (
            <Typography variant="body1" key={k}>
              <span>&#8226;</span> {v}
            </Typography>
          ))}
        </AnswerContainer>
      )}
      {!activeQuestion && <Typography variant="body1">Inget svar</Typography>}
    </ScoreDisplayContainer>
  )
}

export default JudgeScoreDisplay
