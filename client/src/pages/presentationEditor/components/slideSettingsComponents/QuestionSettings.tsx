import { ListItem, ListItemText, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, SettingsList } from '../styled'

type QuestionSettingsProps = {
  activeSlide: RichSlide
  competitionId: string
}

const QuestionSettings = ({ activeSlide, competitionId }: QuestionSettingsProps) => {
  const dispatch = useDispatch()

  const updateQuestion = async (
    updateTitle: boolean,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    console.log('Content was updated on server. id: ', activeSlide.questions[0].id)
    if (activeSlide && activeSlide.questions[0]) {
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
        setScore(+event.target.value)
        await axios
          .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`, {
            total_score: event.target.value,
          })
          .then(() => {
            dispatch(getEditorCompetition(competitionId))
          })
          .catch(console.log)
      }
    }
  }

  const [score, setScore] = useState<number | undefined>(0)
  useEffect(() => {
    setScore(activeSlide?.questions[0]?.total_score)
  }, [activeSlide])

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText primary="Frågeinställningar" secondary="" />
        </Center>
      </ListItem>
      <ListItem divider>
        <Center>
          <TextField
            id="outlined-basic"
            defaultValue={''}
            label="Frågans titel"
            onChange={(event) => updateQuestion(true, event)}
            variant="outlined"
            fullWidth={true}
          />
        </Center>
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
            InputProps={{ inputProps: { min: 0 } }}
            value={score}
            onChange={(event) => updateQuestion(false, event)}
          />
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default QuestionSettings
