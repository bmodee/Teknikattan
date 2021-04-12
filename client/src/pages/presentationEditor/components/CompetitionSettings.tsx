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
      background: 'white',
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
  })
)

const CompetitionSettings: React.FC = () => {
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
        <TextField className={classes.textInput} label="Tävlingsnamn" variant="outlined" />
        <Divider />
        <TextField className={classes.textInput} label="Stad" variant="outlined" />
      </form>

      <List>
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

      <ListItem button>
        <img
          id="temp source, todo: add image source to elements of pictureList"
          src="https://i1.wp.com/stickoutmedia.se/wp-content/uploads/2021/01/placeholder-3.png?ssl=1"
          className={classes.importedImage}
        />
        <ListItemText className={classes.textCenter} primary="Välj bakgrundsbild ..." />
      </ListItem>
    </div>
  )
}

export default CompetitionSettings
