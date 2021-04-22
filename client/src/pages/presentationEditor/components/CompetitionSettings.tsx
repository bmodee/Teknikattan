import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { City } from '../../../interfaces/ApiModels'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textInputContainer: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%',
        background: 'white',
      },
    },
    textInput: {
      margin: theme.spacing(2),
      width: '87%',
      background: 'white',
    },
    textCenter: {
      textAlign: 'center',
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      background: 'white',
    },
    importedImage: {
      width: 70,
      height: 50,
      background: 'white',
    },
    dropDown: {
      margin: theme.spacing(2),
      width: '87%',
      background: 'white',
    },
    addButtons: {
      padding: 5,
    },
    panelList: {
      padding: 0,
    },
  })
)

interface CompetitionParams {
  id: string
}

const CompetitionSettings: React.FC = () => {
  const classes = useStyles()
  const { id }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  const competition = useAppSelector((state) => state.editor.competition)
  const updateCompetitionName = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    await axios
      .put(`/competitions/${id}`, { name: event.target.value })
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const cities = useAppSelector((state) => state.cities.cities)
  const updateCompetitionCity = async (city: City) => {
    await axios
      .put(`/competitions/${id}`, { city_id: city.id })
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    cities.forEach((city) => {
      if (event.target.value === city.name) {
        updateCompetitionCity(city)
      }
    })
  }

  const removeTeam = async (tid: number) => {
    await axios
      .delete(`/competitions/${id}/teams/${tid}`)
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }
  const addTeam = async () => {
    setAddTeamOpen(false)
    await axios
      .post(`/competitions/${id}/teams`, { name: selectedTeamName })
      .then(() => {
        dispatch(getEditorCompetition(id))
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

  return (
    <div className={classes.textInputContainer}>
      <form noValidate autoComplete="off">
        <TextField
          className={classes.textInput}
          id="outlined-basic"
          label={'Tävlingsnamn'}
          defaultValue={competition.name}
          onChange={updateCompetitionName}
          variant="outlined"
        />
        <Divider />
        <FormControl variant="outlined" className={classes.dropDown}>
          <InputLabel>Region</InputLabel>
          <Select
            value={cities.find((city) => city.id === competition.city_id)?.name || ''}
            label="Region"
            onChange={handleChange}
          >
            {cities.map((city) => (
              <MenuItem value={city.name} key={city.name}>
                <Button>{city.name}</Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>

      <List className={classes.panelList}>
        <ListItem>
          <ListItemText className={classes.textCenter} primary="Lag" />
        </ListItem>
        {competition.teams &&
          competition.teams.map((team) => (
            <div key={team.id}>
              <ListItem divider button>
                <ListItemText primary={team.name} />
                <CloseIcon onClick={() => removeTeam(team.id)} />
              </ListItem>
            </div>
          ))}

        <ListItem className={classes.center} button onClick={openAddTeam}>
          <Typography className={classes.addButtons} variant="button">
            Lägg till lag
          </Typography>
        </ListItem>
        <Dialog open={addTeamOpen} onClose={closeAddTeam}>
          <DialogTitle className={classes.center}>Lägg till lag</DialogTitle>
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
      </List>

      <ListItem button>
        <img
          id="temp source, todo: add image source to elements of pictureList"
          src="https://i1.wp.com/stickoutmedia.se/wp-content/uploads/2021/01/placeholder-3.png?ssl=1"
          className={classes.importedImage}
        />
        <ListItemText className={classes.textCenter}>Välj bakgrundsbild ...</ListItemText>
      </ListItem>
    </div>
  )
}

export default CompetitionSettings
