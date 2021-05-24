/**
 * This file contains the BackgroundImageSelect function, which returns a component used to select a background image.
 * This component is used to set a background for either the entire competition, or for a specific slide.
 * It is used in CompetitionSettings and in SlideSettings.
 */
import { ListItem, ListItemText, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { uploadFile } from '../../../utils/uploadImage'
import {
  AddBackgroundButton,
  AddButton,
  Center,
  HiddenInput,
  ImageNameText,
  ImageTextContainer,
  ImportedImage,
  SettingsList,
} from './styled'

type BackgroundImageSelectProps = {
  variant: 'competition' | 'slide'
}

/** Creates and renders a background image selection component */
const BackgroundImageSelect = ({ variant }: BackgroundImageSelectProps) => {
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  /** Gets a background image from either the competition state or the slide state, depending on variant */
  const backgroundImage = useAppSelector((state) => {
    if (variant === 'competition') return state.editor.competition.background_image
    else return state.editor.competition.slides.find((slide) => slide.id === activeSlideId)?.background_image
  })
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const dispatch = useAppDispatch()

  /** Creates a new background image component for the competition or slide on the database using API call. */
  const updateBackgroundImage = async (mediaId: number) => {
    if (variant === 'competition') {
      await axios
        .put(`/api/competitions/${competitionId}`, { background_image_id: mediaId })
        .then(() => {
          dispatch(getEditorCompetition(competitionId.toString()))
        })
        .catch(console.log)
    } else {
      await axios
        .put(`/api/competitions/${competitionId}/slides/${activeSlideId}`, { background_image_id: mediaId })
        .then(() => {
          dispatch(getEditorCompetition(competitionId.toString()))
        })
        .catch(console.log)
    }
  }

  /** Removes background image media and from competition using API calls. */
  const removeBackgroundImage = async () => {
    await axios.delete(`/api/media/images/${backgroundImage?.id}`).catch(console.log)
    if (variant === 'competition') {
      await axios
        .put(`/api/competitions/${competitionId}`, { background_image_id: null })
        .then(() => {
          dispatch(getEditorCompetition(competitionId.toString()))
        })
        .catch(console.log)
    } else {
      await axios
        .put(`/api/competitions/${competitionId}/slides/${activeSlideId}`, { background_image_id: null })
        .then(() => {
          dispatch(getEditorCompetition(competitionId.toString()))
        })
        .catch(console.log)
    }
  }

  /** Reads the selected image file and uploads it to the server.
   * Creates a new background image component containing the file.
   */
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files[0]) {
      const files = Array.from(e.target.files)
      const file = files[0]
      const formData = new FormData()
      formData.append('image', file)
      const media = await uploadFile(formData, competitionId.toString())
      if (media) {
        updateBackgroundImage(media.id)
      }
    }
  }

  return (
    <SettingsList>
      {/** Choose an image */}
      {!backgroundImage && (
        <ListItem button style={{ padding: 0 }}>
          <HiddenInput
            accept="image/*"
            id="background-button-file"
            multiple
            type="file"
            onChange={handleFileSelected}
          />
          <AddBackgroundButton htmlFor="background-button-file">
            <Center>
              <AddButton variant="button">Välj bakgrundsbild...</AddButton>
            </Center>
          </AddBackgroundButton>
        </ListItem>
      )}
      {/** Display thumbnail for chosen image, and remove image */}
      {backgroundImage && (
        <>
          <ListItem divider>
            <ImageTextContainer>
              <ListItemText>Bakgrundsbild</ListItemText>
              <Typography variant="body2">(Bilden bör ha sidförhållande 16:9)</Typography>
            </ImageTextContainer>
          </ListItem>
          <ListItem divider button>
            <ImportedImage src={`/static/images/thumbnail_${backgroundImage.filename}`} />
            <Center>
              <ImageNameText primary={backgroundImage.filename} />
            </Center>
            <CloseIcon onClick={removeBackgroundImage} />
          </ListItem>
        </>
      )}
    </SettingsList>
  )
}

export default BackgroundImageSelect
