import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useState } from 'react'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { RichTeam } from '../../../interfaces/ApiRichModels'
import { AddButton, Center, SettingsList } from './styled'

interface TeamEditState {
  open: boolean
  variant?: 'Edit' | 'Add'
  team?: RichTeam
}

type TeamsProps = {
  competitionId: string
}

const Teams = ({ competitionId }: TeamsProps) => {
  const dispatch = useAppDispatch()
  const competition = useAppSelector((state) => state.editor.competition)
  const [errorActive, setErrorActive] = React.useState(false)
  const editTeam = async () => {
    if (editTeamState.variant === 'Add') {
      await axios
        .post(`/api/competitions/${competitionId}/teams`, { name: selectedTeamName })
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    } else if (editTeamState.team) {
      await axios
        .put(`/api/competitions/${competitionId}/teams/${editTeamState.team.id}`, { name: selectedTeamName })
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch((response) => {
          if (response?.response?.status === 409) setErrorActive(true)
        })
    }
    setEditTeamState({ open: false })
  }
  // For "add team" dialog
  const [editTeamState, setEditTeamState] = useState<TeamEditState>({ open: false })
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
              <IconButton size="small" onClick={() => setEditTeamState({ variant: 'Edit', open: true, team })}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => removeTeam(team.id)}>
                <CloseIcon />
              </IconButton>
            </ListItem>
          </div>
        ))}
      <ListItem button onClick={() => setEditTeamState({ variant: 'Add', open: true })}>
        <Center>
          <AddButton variant="button">Lägg till lag</AddButton>
        </Center>
      </ListItem>
      <Dialog open={editTeamState.open} onClose={() => setEditTeamState({ open: false })}>
        <DialogTitle>
          {editTeamState.variant === 'Edit' && editTeamState.team
            ? `Redigera lagnamn för lag ${editTeamState.team.name}`
            : 'Lägg till lag'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Skriv {editTeamState.variant === 'Edit' ? 'det nya' : ''} namnet på laget och klicka sedan på bekräfta.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Lagnamn"
            fullWidth
            onChange={updateSelectedTeamName}
            defaultValue={editTeamState.variant === 'Edit' ? editTeamState.team?.name : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTeamState({ open: false })} color="secondary">
            Avbryt
          </Button>
          <Button onClick={editTeam} color="primary">
            Bekräfta
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={errorActive} autoHideDuration={4000} onClose={() => setErrorActive(false)}>
        <Alert severity="error">{`Du kan inte välja det namnet eftersom ett annat lag har samma namn, välj ett annat namn och försök igen.`}</Alert>
      </Snackbar>
    </SettingsList>
  )
}

export default Teams
