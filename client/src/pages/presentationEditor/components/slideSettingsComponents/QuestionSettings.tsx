/**
 * This file contatins the question settings component, which in turn lets the competition editor
 * change the name of the question and how many points the participants can get when submittning the correct answer.
 *
 * @module
 */

import { ListItem, ListItemText, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, SettingsItemContainer, SettingsList } from '../styled'

type QuestionSettingsProps = {
  activeSlide: RichSlide
  competitionId: string
}

const QuestionSettings = ({ activeSlide, competitionId }: QuestionSettingsProps) => {
  const dispatch = useAppDispatch()
  const [timerHandle, setTimerHandle] = useState<number | undefined>(undefined)

  const handleChangeQuestion = (
    updateTitle: boolean,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates question and api 500ms after last input was made
    setTimerHandle(window.setTimeout(() => updateQuestion(updateTitle, event), 300))
    if (updateTitle) {
      setName(event.target.value)
    } else setScore(+event.target.value)
  }

  // Set to not let the editor set a bigger number than this to affect the server in a bad way.
  const maxScore = 1000000

  const updateQuestion = async (
    updateTitle: boolean,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (activeSlide && activeSlide.questions?.[0]) {
      if (updateTitle) {
        await axios
          .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`, {
            name: event.target.value,
          })
          .then(() => {
            dispatch(getEditorCompetition(competitionId))
          })
          .catch(console.log)
      } else {
        // Sets score to event.target.value if it's between 0 and max
        const score = Math.max(0, Math.min(+event.target.value, maxScore))
        setScore(score)
        await axios
          .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`, {
            total_score: score,
          })
          .then(() => {
            dispatch(getEditorCompetition(competitionId))
          })
          .catch(console.log)
      }
    }
  }
  const [score, setScore] = useState<number | undefined>(0)
  const [name, setName] = useState<string | undefined>('')
  useEffect(() => {
    setName(activeSlide?.questions?.[0]?.name)
    setScore(activeSlide?.questions?.[0]?.total_score)
  }, [activeSlide])

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText primary="Frågeinställningar" secondary="" />
        </Center>
      </ListItem>
      <ListItem divider>
        <TextField
          id="outlined-basic"
          label="Frågans titel"
          onChange={(event) => handleChangeQuestion(true, event)}
          variant="outlined"
          fullWidth={true}
          value={name || ''}
        />
      </ListItem>
      <ListItem>
        <Center>
          <SettingsItemContainer>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Antal poäng"
              helperText="Välj hur många poäng frågan ska ge för rätt svar.   Lämna blank för att inte använda poängfunktionen"
              label="Poäng"
              type="number"
              InputProps={{ inputProps: { min: 0, max: maxScore } }}
              value={score || ''}
              onChange={(event) => handleChangeQuestion(false, event)}
            />
          </SettingsItemContainer>
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default QuestionSettings
