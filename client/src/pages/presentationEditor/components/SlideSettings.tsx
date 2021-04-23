import {
  Button,
  Checkbox,
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
import { CheckboxProps } from '@material-ui/core/Checkbox'
import { green, grey } from '@material-ui/core/colors'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import { ImageComponent, TextComponent, QuestionAlternative, Media } from '../../../interfaces/ApiModels'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { HiddenInput, TextCard } from './styled'
import TextComponentEdit from './TextComponentEdit'

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
    dropDown: {
      margin: theme.spacing(2),
      width: '87%',
      background: 'white',
      padding: 0,
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
    addButtons: {
      padding: 5,
    },
    panelList: {
      padding: 0,
    },
    addImageButton: {
      padding: 5,
      cursor: 'pointer',
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
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const activeSlide = useAppSelector((state) =>
    state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)
  )

  const handleCloseAnswerClick = async (alternative_id: number) => {
    if (activeSlide && activeSlide.questions[0]) {
      await axios
        .delete(
          `/api/competitions/${id}/slides/${activeSlideId}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative_id}`
        )
        .then(() => {
          dispatch(getEditorCompetition(id))
        })
        .catch(console.log)
    }
  }

  const texts = useAppSelector(
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 1) as TextComponent[]
  )

  const images = useAppSelector(
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 2) as ImageComponent[]
  )

  const handleCloseimageClick = async (image: ImageComponent) => {
    await axios
      .delete(`/api/media/images/${image.data.media_id}`)
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)

    await axios
      .delete(`/api/competitions/${id}/slides/${activeSlide?.id}/components/${image.id}`)
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const updateSlideType = async () => {
    closeSlideTypeDialog()
    if (activeSlide) {
      if (activeSlide.questions[0] && activeSlide.questions[0].type_id !== selectedSlideType) {
        if (selectedSlideType === 0) {
          // Change slide type from a question type to information
          await axios
            .delete(`/api/competitions/${id}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`)
            .then(() => {
              dispatch(getEditorCompetition(id))
            })
            .catch(console.log)
        } else {
          // Change slide type from question type to another question type
          await axios
            .delete(`/api/competitions/${id}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`)
            .catch(console.log)
          await axios
            .post(`/api/competitions/${id}/slides/${activeSlide.id}/questions`, {
              name: 'Ny fråga',
              total_score: 0,
              type_id: selectedSlideType,
              slide_id: activeSlide.id,
            })
            .then(() => {
              dispatch(getEditorCompetition(id))
            })
            .catch(console.log)
        }
      } else if (selectedSlideType !== 0) {
        // Change slide type from information to a question type
        await axios
          .post(`/api/competitions/${id}/slides/${activeSlide.id}/questions`, {
            name: 'Ny fråga',
            total_score: 0,
            type_id: selectedSlideType,
            slide_id: activeSlide.id,
          })
          .then(() => {
            dispatch(getEditorCompetition(id))
          })
          .catch(console.log)
      }
    }
  }

  const updateAlternativeValue = async (alternative: QuestionAlternative) => {
    if (activeSlide && activeSlide.questions[0]) {
      let newValue: number
      if (alternative.value === 0) {
        newValue = 1
      } else newValue = 0
      console.log('newValue: ' + newValue)
      await axios
        .put(
          `/api/competitions/${id}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative.id}`,
          { value: newValue }
        )
        .then(() => {
          dispatch(getEditorCompetition(id))
        })
        .catch(console.log)
    }
  }

  const updateAlternativeText = async (alternative_id: number, newText: string) => {
    if (activeSlide && activeSlide.questions[0]) {
      await axios
        .put(
          `/api/competitions/${id}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative_id}`,
          { text: newText }
        )
        .then(() => {
          dispatch(getEditorCompetition(id))
        })
        .catch(console.log)
    }
  }

  const addAlternative = async () => {
    if (activeSlide && activeSlide.questions[0]) {
      await axios
        .post(
          `/api/competitions/${id}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives`,
          {
            text: '',
            value: 0,
          }
        )
        .then(() => {
          dispatch(getEditorCompetition(id))
        })
        .catch(console.log)
    }
  }

  const uploadFile = async (formData: FormData) => {
    // Uploads the file to the server and creates a Media object in database
    // Returns media id
    return await axios
      .post(`/api/media/images`, formData)
      .then((response) => {
        dispatch(getEditorCompetition(id))
        return response.data as Media
      })
      .catch(console.log)
  }

  const createImageComponent = async (media: Media) => {
    const imageData = {
      x: 0,
      y: 0,
      data: {
        media_id: media.id,
        filename: media.filename,
      },
      type_id: 2,
    }

    await axios
      .post(`/api/competitions/${id}/slides/${activeSlide?.id}/components`, imageData)
      .then(() => {
        dispatch(getEditorCompetition(id))
      })
      .catch(console.log)
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files[0]) {
      const files = Array.from(e.target.files)
      const file = files[0]
      const formData = new FormData()
      formData.append('image', file)
      const response = await uploadFile(formData)

      if (response) {
        const newComponent = createImageComponent(response)
      }
    }
  }

  const handleAddText = async () => {
    if (activeSlide) {
      await axios.post(`/api/competitions/${id}/slides/${activeSlide?.id}/components`, {
        type_id: 1,
        data: { text: 'Ny text' },
        w: 315,
        h: 50,
      })
      dispatch(getEditorCompetition(id))
    }
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

  const updateTimer = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTimer(+event.target.value)
    if (activeSlide) {
      await axios
        .put(`/api/competitions/${id}/slides/${activeSlide.id}`, { timer: event.target.value })
        .then(() => {
          dispatch(getEditorCompetition(id))
        })
        .catch(console.log)
    }
  }
  const [timer, setTimer] = useState<number | undefined>(0)
  useEffect(() => {
    setTimer(activeSlide?.timer)
  }, [activeSlide])

  // For "slide type" dialog
  const [selectedSlideType, setSelectedSlideType] = useState(0)
  const [slideTypeDialog, setSlideTypeDialog] = useState(false)
  const openSlideTypeDialog = (type_id: number) => {
    setSelectedSlideType(type_id)
    setSlideTypeDialog(true)
  }
  const closeSlideTypeDialog = () => {
    setSlideTypeDialog(false)
  }

  const numberToBool = (num: number) => {
    if (num === 0) return false
    else return true
  }

  return (
    <div className={classes.textInputContainer}>
      <div className={classes.whiteBackground}>
        <FormControl variant="outlined" className={classes.dropDown}>
          <InputLabel>Sidtyp</InputLabel>
          <Select value={activeSlide?.questions[0]?.type_id || 0} label="Sidtyp" className={classes.panelList}>
            <MenuItem value={0}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(0)}>
                Informationssida
              </Typography>
            </MenuItem>
            <MenuItem value={1}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(1)}>
                Skriftlig fråga
              </Typography>
            </MenuItem>
            <MenuItem value={2}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(2)}>
                Praktisk fråga
              </Typography>
            </MenuItem>
            <MenuItem value={3}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(3)}>
                Flervalsfråga
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <Dialog open={slideTypeDialog} onClose={closeSlideTypeDialog}>
        <DialogTitle className={classes.center} color="secondary">
          Varning!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Om du ändrar sidtypen kommer eventuella frågeinställningar gå förlorade. Det inkluderar: frågans namn, poäng
            och svarsalternativ.{' '}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSlideTypeDialog} color="secondary">
            Avbryt
          </Button>
          <Button onClick={updateSlideType} color="primary">
            Bekräfta
          </Button>
        </DialogActions>
      </Dialog>

      <ListItem>
        <TextField
          id="standard-number"
          variant="outlined"
          placeholder="Antal sekunder"
          helperText="Lämna blank för att inte använda timerfunktionen"
          label="Timer"
          type="number"
          onChange={updateTimer}
          value={timer || ''}
        />
      </ListItem>

      <List className={classes.panelList}>
        <ListItem divider>
          <ListItemText
            className={classes.textCenter}
            primary="Svarsalternativ"
            secondary="(Fyll i rutan höger om textfältet för att markera korrekt svar)"
          />
        </ListItem>
        {activeSlide &&
          activeSlide.questions[0] &&
          activeSlide.questions[0].alternatives &&
          activeSlide.questions[0].alternatives.map((alt) => (
            <div key={alt.id}>
              <ListItem divider>
                <TextField
                  className={classes.textInput}
                  id="outlined-basic"
                  defaultValue={alt.text}
                  onChange={(event) => updateAlternativeText(alt.id, event.target.value)}
                  variant="outlined"
                />
                <GreenCheckbox checked={numberToBool(alt.value)} onChange={() => updateAlternativeValue(alt)} />
                <CloseIcon className={classes.clickableIcon} onClick={() => handleCloseAnswerClick(alt.id)} />
              </ListItem>
            </div>
          ))}
        <ListItem className={classes.center} button onClick={addAlternative}>
          <Typography className={classes.addButtons} variant="button">
            Lägg till svarsalternativ
          </Typography>
        </ListItem>
      </List>

      <List className={classes.panelList}>
        <ListItem divider>
          <ListItemText className={classes.textCenter} primary="Text" />
        </ListItem>
        {texts &&
          texts.map((text) => (
            <TextCard elevation={4} key={text.id}>
              <TextComponentEdit component={text} />

              <Divider />
            </TextCard>
          ))}

        <ListItem className={classes.center} button onClick={handleAddText}>
          <Typography className={classes.addButtons} variant="button">
            Lägg till text
          </Typography>
        </ListItem>
      </List>

      <List className={classes.panelList}>
        <ListItem divider>
          <ListItemText className={classes.textCenter} primary="Bilder" />
        </ListItem>
        {images &&
          images.map((image) => (
            <div key={image.id}>
              <ListItem divider button>
                <img
                  src={`http://localhost:5000/static/images/thumbnail_${image.data.filename}`}
                  className={classes.importedImage}
                />
                <ListItemText className={classes.textCenter} primary={image.data.filename} />
                <CloseIcon onClick={() => handleCloseimageClick(image)} />
              </ListItem>
            </div>
          ))}
        <ListItem className={classes.center} button>
          <HiddenInput accept="image/*" id="contained-button-file" multiple type="file" onChange={handleFileSelected} />

          <label className={classes.addImageButton} htmlFor="contained-button-file">
            <Typography variant="button">Lägg till bild</Typography>
          </label>
        </ListItem>
      </List>

      <ListItem button>
        <img
          id="temp source, todo: add image source to elements of imageList"
          src="https://i1.wp.com/stickoutmedia.se/wp-content/uploads/2021/01/placeholder-3.png?ssl=1"
          className={classes.importedImage}
        />
        <ListItemText className={classes.textCenter}>Välj bakgrundsbild ...</ListItemText>
      </ListItem>
    </div>
  )
}

export default SlideSettings
