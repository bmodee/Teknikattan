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
import { CheckboxProps } from '@material-ui/core/Checkbox'
import { green, grey } from '@material-ui/core/colors'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined'
import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { TextComponent } from '../../../interfaces/ApiModels'
import { HiddenInput } from './styled'

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

interface CompetitionParams {
  id: string
}

const SlideSettings: React.FC = () => {
  const classes = useStyles()
  const { id }: CompetitionParams = useParams()
  const dispatch = useAppDispatch()
  const competition = useAppSelector((state) => state.editor.competition)
  let currentSlide = competition.slides[0]
  // Init currentSlide if slides are not in order
  for (const slide of competition.slides) {
    if (slide.order === 1) {
      currentSlide = slide
      break
    }
  }

  const handleCloseAnswerClick = async (alternative: number) => {
    await axios
      // TODO: implementera API för att kunnata bort svarsalternativ
      .delete(`/competitions/${id}/slide/question/alternative/${alternative}`)
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const texts = useAppSelector(
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 1) as TextComponent[]
  )

  const pictureList = [
    { id: 'picture1', name: 'Picture1.jpeg' },
    { id: 'picture2', name: 'Picture2.jpeg' },
  ]
  const handleClosePictureClick = (id: string) => {
    setPictures(pictures.filter((item) => item.id !== id)) //Will not be done like this when api is used
  }
  const [pictures, setPictures] = useState(pictureList)

  const updateSlideType = async (event: React.ChangeEvent<{ value: unknown }>) => {
    await axios
      // TODO: implementera API för att kunna ändra i questions->type_id
      .put(`/competitions/${id}/slides/${currentSlide?.id}`, { type_id: event.target.value })
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const updateAlternativeValue = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Wheter the alternative is true or false
    await axios
      // TODO: implementera API för att kunna ändra i alternatives->value
      .put(`/competitions/${id}/slides/${currentSlide?.id}`, { value: event.target.value })
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files[0]) {
      const files = Array.from(e.target.files)
      const file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        console.log(reader.result)
        // TODO: Send image to back-end (remove console.log)
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    }
  }

  const handleAddText = async () => {
    console.log('Add text component')
    // TODO: post the new text]
    // setTexts([...texts, { id: 'newText', name: 'New Text' }])
  }

  const GreenCheckbox = withStyles({
    root: {
      color: grey[900],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />)

  return (
    <div className={classes.textInputContainer}>
      <div className={classes.whiteBackground}>
        <FormControl variant="outlined" className={classes.dropDown}>
          <InputLabel id="slide-type-selection-label">Sidtyp</InputLabel>
          <Select value={currentSlide?.questions[0].type_id || 0} label="Sidtyp" onChange={updateSlideType}>
            <MenuItem value={0}>
              <Button>Informationssida</Button>
            </MenuItem>
            <MenuItem value={1}>
              <Button>Skriftlig fråga</Button>
            </MenuItem>
            <MenuItem value={2}>
              <Button>Praktisk fråga</Button>
            </MenuItem>
            <MenuItem value={3}>
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
          value={currentSlide?.timer}
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
        {currentSlide &&
          currentSlide.questions[0] &&
          currentSlide.questions[0].question_alternatives &&
          currentSlide.questions[0].question_alternatives.map((alt) => (
            <div key={alt.id}>
              <ListItem divider>
                <TextField
                  className={classes.textInput}
                  id="outlined-basic"
                  label={`Svar ${alt.id}`}
                  value={alt.text}
                  variant="outlined"
                />
                <GreenCheckbox checked={alt.value} onChange={updateAlternativeValue} />
                <CloseIcon className={classes.clickableIcon} onClick={() => handleCloseAnswerClick(alt.id)} />
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
        {texts &&
          texts.map((text) => (
            <div key={text.id}>
              <ListItem divider>
                <TextField className={classes.textInput} label={text.data.text} variant="outlined" />
                <MoreHorizOutlinedIcon className={classes.clickableIcon} />
                <CloseIcon className={classes.clickableIcon} />
              </ListItem>
            </div>
          ))}
        <ListItem className={classes.center} button onClick={handleAddText}>
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
          <HiddenInput accept="image/*" id="contained-button-file" multiple type="file" onChange={handleFileSelected} />

          <label htmlFor="contained-button-file">
            <Button component="span">Lägg till bild</Button>
          </label>
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
