/**
 * This file handles creating and removing image components, and uploading and removing image files from the server.
 *
 * @module
 */

import { ListItem, ListItemText } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { ImageComponent, Media } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { AddButton, AddImageButton, Center, HiddenInput, ImportedImage, SettingsList } from '../styled'

type ImagesProps = {
  activeViewTypeId: number
  activeSlide: RichSlide
  competitionId: string
}

const Images = ({ activeViewTypeId, activeSlide, competitionId }: ImagesProps) => {
  const dispatch = useAppDispatch()

  const uploadFile = async (formData: FormData) => {
    // Uploads the file to the server and creates a Media object in database.
    // Returns media object data.
    return await axios
      .post(`/api/media/images`, formData)
      .then((response) => {
        dispatch(getEditorCompetition(competitionId))
        return response.data as Media
      })
      .catch(console.log)
  }

  const createImageComponent = async (media: Media) => {
    // Creates a new image component on the database using API call.
    const imageData = {
      x: 0,
      y: 0,
      media_id: media.id,
      type_id: 2,
      view_type_id: activeViewTypeId,
    }
    await axios
      .post(`/api/competitions/${competitionId}/slides/${activeSlide?.id}/components`, imageData)
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reads the selected image file and uploads it to the server.
    // Creates a new image component containing the file.
    if (e.target.files !== null && e.target.files[0]) {
      const files = Array.from(e.target.files)
      const file = files[0]
      const formData = new FormData()
      formData.append('image', file)
      const response = await uploadFile(formData)
      if (response) {
        createImageComponent(response)
      }
    }
  }

  const handleCloseimageClick = async (image: ImageComponent) => {
    // Removes selected image component and deletes its file from the server.
    await axios
      .delete(`/api/media/images/${image.media?.id}`)
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)

    await axios
      .delete(`/api/competitions/${competitionId}/slides/${activeSlide?.id}/components/${image.id}`)
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  const images = useAppSelector(
    // Updates component state to match image components found on database.
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 2) as ImageComponent[]
  )

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText primary="Bilder" />
        </Center>
      </ListItem>
      {images &&
        images
          .filter((image) => image.view_type_id === activeViewTypeId)
          .map((image) => (
            <div key={image.id}>
              <ListItem divider button>
                <ImportedImage src={`http://localhost:5000/static/images/thumbnail_${image.media?.filename}`} />
                <Center>
                  <ListItemText primary={image.media?.filename} />
                </Center>
                <CloseIcon onClick={() => handleCloseimageClick(image)} />
              </ListItem>
            </div>
          ))}

      <ListItem button style={{ padding: 0 }}>
        <HiddenInput accept="image/*" id="contained-button-file" multiple type="file" onChange={handleFileSelected} />
        <AddImageButton htmlFor="contained-button-file">
          <AddButton variant="button">Lägg till bild</AddButton>
        </AddImageButton>
      </ListItem>
    </SettingsList>
  )
}

export default Images
