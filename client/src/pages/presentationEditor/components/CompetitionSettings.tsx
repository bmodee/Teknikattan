import {
  Divider,
  FormControl,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { Center, ImportedImage, SettingsList, PanelContainer, FirstItem, AddButton } from './styled'
import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { City } from '../../../interfaces/ApiModels'
import Teams from './Teams'
import BackgroundImageSelect from './BackgroundImageSelect'

interface CompetitionParams {
  competitionId: string
}

const CompetitionSettings: React.FC = () => {
  const { competitionId }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  const competition = useAppSelector((state) => state.editor.competition)
  const cities = useAppSelector((state) => state.cities.cities)

  const updateCompetitionName = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    await axios
      .put(`/api/competitions/${competitionId}`, { name: event.target.value })
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  const updateCompetitionCity = async (city: City) => {
    await axios
      .put(`/api/competitions/${competitionId}`, { city_id: city.id })
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  /* Finds the right city object from a city name */
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    cities.forEach((city) => {
      if (event.target.value === city.name) {
        updateCompetitionCity(city)
      }
    })
  }

  return (
    <PanelContainer>
      <SettingsList>
        <FirstItem>
          <ListItem>
            <TextField
              id="outlined-basic"
              label={'Tävlingsnamn'}
              defaultValue={competition.name}
              onChange={updateCompetitionName}
              variant="outlined"
              fullWidth={true}
            />
          </ListItem>
        </FirstItem>
        <Divider />

        <ListItem>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Region</InputLabel>
            <Select
              value={cities.find((city) => city.id === competition.city_id)?.name || ''}
              label="Region"
              onChange={handleChange}
            >
              {cities.map((city) => (
                <MenuItem value={city.name} key={city.name}>
                  <Typography variant="button">{city.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
      </SettingsList>

      <Teams competitionId={competitionId} />

      <BackgroundImageSelect variant="competition" />
    </PanelContainer>
  )
}

export default CompetitionSettings
