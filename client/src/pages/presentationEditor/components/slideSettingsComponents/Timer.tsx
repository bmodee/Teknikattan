import { ListItem, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, SettingsItemContainer } from '../styled'

type TimerProps = {
  activeSlide: RichSlide
  competitionId: string
}

const Timer = ({ activeSlide, competitionId }: TimerProps) => {
  const maxTime = 1000000 // ms
  const dispatch = useAppDispatch()
  const [timerHandle, setTimerHandle] = useState<number | undefined>(undefined)
  const handleChangeTimer = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates slide and api 300s after last input was made
    setTimerHandle(window.setTimeout(() => updateTimer(event), 300))
    setTimer(+event.target.value)
  }

  const updateTimer = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    /** If timer value is above the max value, set the timer value to max value to not overflow the server */
    // Sets score to event.target.value if it's between 0 and max
    const timerValue = Math.max(0, Math.min(+event.target.value, maxTime))
    if (activeSlide) {
      setTimer(timerValue)
      await axios
        .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}`, { timer: timerValue })
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const [timer, setTimer] = useState<number | null>(activeSlide?.timer)
  useEffect(() => {
    setTimer(activeSlide?.timer)
  }, [activeSlide])
  return (
    <ListItem>
      <Center>
        <SettingsItemContainer>
          <TextField
            id="standard-number"
            fullWidth={true}
            variant="outlined"
            placeholder="Antal sekunder"
            helperText="Lämna blank för att inte använda timerfunktionen"
            label="Timer"
            type="number"
            onChange={handleChangeTimer}
            InputProps={{ inputProps: { min: 0, max: 1000000 } }}
            value={timer || ''}
          />
        </SettingsItemContainer>
      </Center>
    </ListItem>
  )
}

export default Timer
