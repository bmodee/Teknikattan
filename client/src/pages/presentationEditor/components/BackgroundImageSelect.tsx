import { ListItem, ListItemText, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import {
  AddButton,
  AddBackgroundButton,
  Center,
  HiddenInput,
  ImportedImage,
  SettingsList,
  ImageNameText,
  ImageTextContainer,
} from './styled'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import { Media } from '../../../interfaces/ApiModels'
import { getEditorCompetition } from '../../../actions/editor'
import { uploadFile } from '../../../utils/uploadImage'

type BackgroundImageSelectProps = {
  variant: 'competition' | 'slide'
}

const BackgroundImageSelect = ({ variant }: BackgroundImageSelectProps) => {
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const backgroundImage = useAppSelector((state) => {
    if (variant === 'competition') return state.editor.competition.background_image
    else return state.editor.competition.slides.find((slide) => slide.id === activeSlideId)?.background_image
  })
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const dispatch = useAppDispatch()

  const updateBackgroundImage = async (mediaId: number) => {
    // Creates a new image component on the database using API call.
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

  const removeBackgroundImage = async () => {
    // Removes background image media and from competition using API calls.
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

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reads the selected image file and uploads it to the server.
    // Creates a new image component containing the file.
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
