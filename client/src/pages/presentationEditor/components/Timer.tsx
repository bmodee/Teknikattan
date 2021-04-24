import { ListItem, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch } from '../../../hooks'
import { RichSlide } from '../../../interfaces/ApiRichModels'
import { Center, WhiteBackground } from './styled'

type TimerProps = {
  activeSlide: RichSlide
  competitionId: string
}

const Timer = ({ activeSlide, competitionId }: TimerProps) => {
  const dispatch = useAppDispatch()
  const updateTimer = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTimer(+event.target.value)
    if (activeSlide) {
      await axios
        .put(`/api/competitions/${competitionId}/slides/${activeSlide.id}`, { timer: event.target.value })
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }
  const [timer, setTimer] = useState<number | undefined>(0)
  useEffect(() => {
    setTimer(activeSlide?.timer)
  }, [activeSlide])
  return (
    <WhiteBackground>
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
            defaultValue={activeSlide?.timer || 0}
            onChange={updateTimer}
            value={timer}
          />
        </Center>
      </ListItem>
    </WhiteBackground>
  )
}

export default Timer
