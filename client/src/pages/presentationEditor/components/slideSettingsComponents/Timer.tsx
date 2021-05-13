import { ListItem, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center } from '../styled'

type TimerProps = {
  activeSlide: RichSlide
  competitionId: string
}

const Timer = ({ activeSlide, competitionId }: TimerProps) => {
  const maxTime = 1000 // ms
  const dispatch = useAppDispatch()
  const updateTimer = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    /** If timer value is above the max value, set the timer value to max value to not overflow the server */
    if (+event.target.value > maxTime) {
      setTimer(maxTime)
      await axios
        .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}`, { timer: maxTime || null })
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
      return maxTime
    } else {
      setTimer(+event.target.value)
    }
    if (activeSlide) {
      await axios
        .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}`, { timer: event.target.value || null })
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const [timer, setTimer] = useState<number | undefined>(activeSlide?.timer)
  useEffect(() => {
    setTimer(activeSlide?.timer)
  }, [activeSlide])
  return (
    <ListItem>
      <Center>
        <TextField
          id="standard-number"
          fullWidth={true}
          variant="outlined"
          placeholder="Antal sekunder"
          helperText="Lämna blank för att inte använda timerfunktionen"
          label="Timer"
          type="number"
          onChange={updateTimer}
          inputProps={{ max: maxTime }}
          value={timer || ''}
        />
      </Center>
    </ListItem>
  )
}

export default Timer
