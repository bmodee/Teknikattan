import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemText,
  TextField,
} from '@material-ui/core'
import axios from 'axios'
import React, { useState } from 'react'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { Center, Clickable } from './styled'
import { AddButton, SettingsList } from './styled'
import CloseIcon from '@material-ui/icons/Close'

type TeamsProps = {
  competitionId: string
}

const Teams = ({ competitionId }: TeamsProps) => {
  const dispatch = useAppDispatch()
  const competition = useAppSelector((state) => state.editor.competition)
  const addTeam = async () => {
    setAddTeamOpen(false)
    await axios
      .post(`/api/competitions/${competitionId}/teams`, { name: selectedTeamName })
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }
  // For "add team" dialog
  const [addTeamOpen, setAddTeamOpen] = useState(false)
  const openAddTeam = () => {
    setAddTeamOpen(true)
  }
  const closeAddTeam = () => {
    setAddTeamOpen(false)
  }
  let selectedTeamName = ''
  const updateSelectedTeamName = (event: React.ChangeEvent<{ value: string }>) => {
    selectedTeamName = event.target.value
  }

  const removeTeam = async (tid: number) => {
    await axios
      .delete(`/api/competitions/${competitionId}/teams/${tid}`)
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText primary="Lag" />
        </Center>
      </ListItem>
      {competition.teams &&
        competition.teams.map((team) => (
          <div key={team.id}>
            <ListItem divider>
              <ListItemText primary={team.name} />
              <Clickable>
                <CloseIcon onClick={() => removeTeam(team.id)} />
              </Clickable>
            </ListItem>
          </div>
        ))}
      <ListItem button onClick={openAddTeam}>
        <Center>
          <AddButton variant="button">Lägg till lag</AddButton>
        </Center>
      </ListItem>
      <Dialog open={addTeamOpen} onClose={closeAddTeam}>
        <DialogTitle>Lägg till lag</DialogTitle>
        <DialogContent>
          <DialogContentText>Skriv namnet på laget och klicka sedan på bekräfta.</DialogContentText>
          <TextField autoFocus margin="dense" label="Lagnamn" fullWidth onChange={updateSelectedTeamName} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddTeam} color="secondary">
            Avbryt
          </Button>
          <Button onClick={addTeam} color="primary">
            Bekräfta
          </Button>
        </DialogActions>
      </Dialog>
    </SettingsList>
  )
}

export default Teams
