import { ListItem, ListItemText, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, SettingsList } from '../styled'

type QuestionSettingsProps = {
  activeSlide: RichSlide
  competitionId: string
}

const QuestionSettings = ({ activeSlide, competitionId }: QuestionSettingsProps) => {
  const dispatch = useAppDispatch()
  const maxScore = 1000

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
        if (+event.target.value > maxScore) {
          setScore(maxScore)
          await axios
            .put(
              `/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`,
              {
                total_score: maxScore,
              }
            )
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
            })
            .catch(console.log)
          return maxScore
        } else {
          setScore(+event.target.value)
          await axios
            .put(
              `/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`,
              {
                total_score: event.target.value,
              }
            )
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
            })
            .catch(console.log)
        }
      }
    }
  }

  const [score, setScore] = useState<number | undefined>(0)
  useEffect(() => {
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
          defaultValue={''}
          label="Frågans titel"
          onChange={(event) => updateQuestion(true, event)}
          variant="outlined"
          fullWidth={true}
        />
      </ListItem>
      <ListItem>
        <Center>
          <TextField
            fullWidth={true}
            variant="outlined"
            placeholder="Antal poäng"
            helperText="Välj hur många poäng frågan ska ge för rätt svar."
            label="Poäng"
            type="number"
            InputProps={{ inputProps: { min: 0, max: maxScore } }}
            value={score || 0}
            onChange={(event) => updateQuestion(false, event)}
          />
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default QuestionSettings
