import { Button, Divider, List, ListItem, ListItemText, TextField } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import React, { useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textInputContainer: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
    textInput: {
      margin: theme.spacing(2),
      width: '87%',
    },
    textCenter: {
      textAlign: 'center',
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
)
interface TeamListItemProps {
  name: string
}

const CompetitionSettings: React.FC = (props) => {
  const classes = useStyles()
  const initialList = [
    { id: '1', name: 'Lag1' },
    { id: '2', name: 'Lag2' },
    { id: '3', name: 'Lag3' },
  ]
  const handleClick = (id: string) => {
    setTeams(teams.filter((item) => item.id !== id)) //Will not be done like this when api is used
  }
  const [teams, setTeams] = useState(initialList)
  return (
    <div className={classes.textInputContainer}>
      <form noValidate autoComplete="off">
        <TextField className={classes.textInput} id="outlined-basic" label="Tävlingsnamn" variant="outlined" />
        <Divider />
        <TextField className={classes.textInput} id="outlined-basic" label="Stad" variant="outlined" />
      </form>
      <List>
        <Divider />
        <ListItem>
          <ListItemText className={classes.textCenter} primary="Lag" />
        </ListItem>
        {teams.map((team) => (
          <div key={team.id}>
            <ListItem divider button>
              <ListItemText primary={team.name} />
              <CloseIcon onClick={() => handleClick(team.id)} />
            </ListItem>
          </div>
        ))}
        <ListItem className={classes.center} button>
          <Button>Lägg till lag</Button>
        </ListItem>
      </List>
    </div>
  )
}

export default CompetitionSettings
