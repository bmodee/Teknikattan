import { ListItem, ListItemText, TextField, withStyles } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, SettingsList } from '../styled'

type InstructionsProps = {
  activeSlide: RichSlide
  competitionId: string
}

const Instructions = ({ activeSlide, competitionId }: InstructionsProps) => {
  const dispatch = useDispatch()
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)

  const updateInstructionsText = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    /* TODO: Implement instructions field in question and add put API
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
            .put(
              `/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`,
              {
                name: event.target.value,
              }
            )
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
            })
            .catch(console.log)
        }
      }, 250)
    )
    */
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
            defaultValue={''}
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
