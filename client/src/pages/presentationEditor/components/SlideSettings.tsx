import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined'
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
    dropDown: {
      margin: theme.spacing(2),
      width: '87%',
      background: 'white',
    },
    clickableIcon: {
      cursor: 'pointer',
      background: 'white',
    },
    importedImage: {
      width: 70,
      height: 50,
      background: 'white',
    },
    whiteBackground: {
      background: 'white',
    },
  })
)

const SlideSettings: React.FC = () => {
  const classes = useStyles()

  const [slideTypeSelected, selectSlideType] = React.useState('')
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    selectSlideType(event.target.value as string)
  }

  const answerList = [
    { id: 'answer1', name: 'Svar 1' },
    { id: 'answer2', name: 'Svar 2' },
  ]
  const handleCloseAnswerClick = (id: string) => {
    setAnswers(answers.filter((item) => item.id !== id)) //Will not be done like this when api is used
  }
  const [answers, setAnswers] = useState(answerList)

  const textList = [
    { id: 'text1', name: 'Text 1' },
    { id: 'text2', name: 'Text 2' },
  ]
  const handleCloseTextClick = (id: string) => {
    setTexts(texts.filter((item) => item.id !== id)) //Will not be done like this when api is used
  }
  const [texts, setTexts] = useState(textList)

  const pictureList = [
    { id: 'picture1', name: 'Picture1.jpeg' },
    { id: 'picture2', name: 'Picture2.jpeg' },
  ]
  const handleClosePictureClick = (id: string) => {
    setPictures(pictures.filter((item) => item.id !== id)) //Will not be done like this when api is used
  }
  const [pictures, setPictures] = useState(pictureList)

  return (
    <div className={classes.textInputContainer}>
      <div className={classes.whiteBackground}>
        <FormControl variant="outlined" className={classes.dropDown}>
          <InputLabel id="slide-type-selection-label">Sidtyp</InputLabel>
          <Select value={slideTypeSelected} label="Sidtyp" defaultValue="informationSlide" onChange={handleChange}>
            <MenuItem value="informationSlide">
              <Button>Informationssida</Button>
            </MenuItem>
            <MenuItem value="textQuestion">
              <Button>Skriftlig fråga</Button>
            </MenuItem>
            <MenuItem value="practicalQuestion">
              <Button>Praktisk fråga</Button>
            </MenuItem>
            <MenuItem value="multipleChoiceQuestion">
              <Button>Flervalsfråga</Button>
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <ListItem>
        <TextField
          id="standard-number"
          variant="outlined"
          placeholder="Antal sekunder"
          helperText="Lämna blank för att inte använda timerfunktionen"
          label="Timer"
          type="number"
        />
      </ListItem>

      <List>
        <ListItem divider>
          <ListItemText
            className={classes.textCenter}
            primary="Svarsalternativ"
            secondary="(Fyll i rutan höger om textfältet för att markera korrekt svar)"
          />
        </ListItem>
        {answers.map((answer) => (
          <div key={answer.id}>
            <ListItem divider>
              <TextField className={classes.textInput} label={answer.name} variant="outlined" />
              <Checkbox color="default" />
              <CloseIcon className={classes.clickableIcon} onClick={() => handleCloseAnswerClick(answer.id)} />
            </ListItem>
          </div>
        ))}
        <ListItem className={classes.center} button>
          <Button>Lägg till svarsalternativ</Button>
        </ListItem>
      </List>

      <List>
        <ListItem divider>
          <ListItemText className={classes.textCenter} primary="Text" />
        </ListItem>
        {texts.map((text) => (
          <div key={text.id}>
            <ListItem divider>
              <TextField className={classes.textInput} label={text.name} variant="outlined" />
              <MoreHorizOutlinedIcon className={classes.clickableIcon} />
              <CloseIcon className={classes.clickableIcon} onClick={() => handleCloseTextClick(text.id)} />
            </ListItem>
          </div>
        ))}
        <ListItem className={classes.center} button>
          <Button>Lägg till text</Button>
        </ListItem>
      </List>

      <List>
        <ListItem divider>
          <ListItemText className={classes.textCenter} primary="Bilder" />
        </ListItem>
        {pictures.map((picture) => (
          <div key={picture.id}>
            <ListItem divider button>
              <img
                id="temp source, todo: add image source to elements of pictureList"
                src="https://i1.wp.com/stickoutmedia.se/wp-content/uploads/2021/01/placeholder-3.png?ssl=1"
                className={classes.importedImage}
              />
              <ListItemText className={classes.textCenter} primary={picture.name} />
              <CloseIcon onClick={() => handleClosePictureClick(picture.id)} />
            </ListItem>
          </div>
        ))}
        <ListItem className={classes.center} button>
          <Button>Lägg till bild</Button>
        </ListItem>
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

export default SlideSettings
