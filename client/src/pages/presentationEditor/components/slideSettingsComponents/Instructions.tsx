import { ListItem, ListItemText, TextField, withStyles } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, SettingsList } from '../styled'

type InstructionsProps = {
  activeSlide: RichSlide
  competitionId: string
}

const Instructions = ({ activeSlide, competitionId }: InstructionsProps) => {
  const dispatch = useAppDispatch()
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)

  const updateInstructionsText = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates 250ms after last input was made to not spam
    setTimerHandle(
      window.setTimeout(async () => {
        console.log('Content was updated on server. id: ', activeSlide.questions[0].id)
        if (activeSlide && activeSlide.questions[0]) {
          await axios
            // TODO: Implement instructions field in question and add put API
            .put(
              `/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`,
              {
                correcting_instructions: event.target.value,
              }
            )
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
            })
            .catch(console.log)
        }
      }, 250)
    )
  }

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText
            primary="Rättningsinstruktioner"
            secondary="Den här texten kommer endast att visas för domarna."
          />
        </Center>
      </ListItem>
      <ListItem divider>
        <Center>
          <TextField
            id="outlined-basic"
            defaultValue={activeSlide.questions[0].correcting_instructions}
            onChange={updateInstructionsText}
            variant="outlined"
            fullWidth={true}
          />
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default Instructions
