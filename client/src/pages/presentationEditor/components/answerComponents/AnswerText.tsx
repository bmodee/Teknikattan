/**
 * What it is:
 * Returns the component for the text question type ("Skriftlig fråga")
 * which is a part of a question component which displayed in the participant view in the editor and presentation.
 * This is the component the users will interact with to answer text questions.
 * In practice the participants writes their answer in a text field.
 *
 * How it's used:
 * This file is used when a question component is to be rendered which only happens in QuestionComponentDisplay.tsx.
 * For more information read the documentation of that file.
 *
 * @module
 */

import { ListItem, ListItemText, TextField } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { getPresentationCompetition } from '../../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center } from '../styled'
import { AnswerTextFieldContainer } from './styled'

type AnswerTextProps = {
  activeSlide: RichSlide | undefined
  competitionId: string
}

const AnswerText = ({ activeSlide, competitionId }: AnswerTextProps) => {
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const dispatch = useAppDispatch()
  const teamId = useAppSelector((state) => state.competitionLogin.data?.team_id)
  const team = useAppSelector((state) => state.presentation.competition.teams.find((team) => team.id === teamId))

  const onAnswerChange = (answer: string) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates answer 100ms after last input was made
    setTimerHandle(window.setTimeout(() => updateAnswer(answer), 100))
  }

  const updateAnswer = async (answer: string) => {
    if (!activeSlide) {
      return
    }
    const alternative = activeSlide.questions[0].alternatives[0]
    const url = `/api/competitions/${competitionId}/teams/${teamId}/answers/question_alternatives/${alternative.id}`
    await axios
      .put(url, { answer })
      .then(() => {
        dispatch(getPresentationCompetition(competitionId))
      })
      .catch(console.log)
  }

  const getDefaultString = () => {
    if (!team || !activeSlide) {
      return
    }
    const activeAltId = activeSlide.questions[0]?.alternatives[0]?.id
    return (
      team.question_alternative_answers.find((questionAnswer) => questionAnswer.question_alternative_id === activeAltId)
        ?.answer || ''
    )
  }

  return (
    <AnswerTextFieldContainer>
      <ListItem divider>
        <Center>
          <ListItemText primary="Skriv ditt svar nedan" />
        </Center>
      </ListItem>
      <ListItem style={{ height: '100%' }}>
        <TextField
          disabled={team === undefined}
          defaultValue={getDefaultString()}
          style={{ height: '100%' }}
          variant="outlined"
          fullWidth={true}
          multiline
          onChange={(event) => onAnswerChange(event.target.value)}
        />
      </ListItem>
    </AnswerTextFieldContainer>
  )
}

export default AnswerText
