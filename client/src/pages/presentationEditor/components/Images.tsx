import { ListItem, ListItemText, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Center,
  HiddenInput,
  SettingsList,
  AddImageButton,
  ImportedImage,
  WhiteBackground,
  AddButton,
  Clickable,
  NoPadding,
} from './styled'
import axios from 'axios'
import { getEditorCompetition } from '../../../actions/editor'
import { RichSlide } from '../../../interfaces/ApiRichModels'
import { ImageComponent, Media } from '../../../interfaces/ApiModels'
import { useAppSelector } from '../../../hooks'

type ImagesProps = {
  activeSlide: RichSlide
  competitionId: string
}

const Images = ({ activeSlide, competitionId }: ImagesProps) => {
  const pictureList = [
    { id: 'picture1', name: 'Picture1.jpeg' },
    { id: 'picture2', name: 'Picture2.jpeg' },
  ]
  const handleClosePictureClick = (id: string) => {
    setPictures(pictures.filter((item) => item.id !== id)) //Will not be done like this when api is used
  }
  const [pictures, setPictures] = useState(pictureList)

  const dispatch = useDispatch()

  const uploadFile = async (formData: FormData) => {
    // Uploads the file to the server and creates a Media object in database
    // Returns media id
    return await axios
      .post(`/api/media/images`, formData)
      .then((response) => {
        dispatch(getEditorCompetition(competitionId))
        return response.data as Media
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
      .post(`/api/competitions/${competitionId}/slides/${activeSlide?.id}/components`, imageData)
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  const handleCloseimageClick = async (image: ImageComponent) => {
    await axios
      .delete(`/api/media/images/${image.data.media_id}`)
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
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 2) as ImageComponent[]
  )

  return (
    <SettingsList>
      <WhiteBackground>
        <ListItem divider>
          <Center>
            <ListItemText primary="Bilder" />
          </Center>
        </ListItem>
        {images &&
          images.map((image) => (
            <div key={image.id}>
              <ListItem divider button>
                <ImportedImage src={`http://localhost:5000/static/images/thumbnail_${image.data.filename}`} />
                <Center>
                  <ListItemText primary={image.data.filename} />
                </Center>
                <CloseIcon onClick={() => handleCloseimageClick(image)} />
              </ListItem>
            </div>
          ))}

        <ListItem button>
          <HiddenInput accept="image/*" id="contained-button-file" multiple type="file" onChange={handleFileSelected} />
          <AddImageButton htmlFor="contained-button-file">
            <AddButton variant="button">Lägg till bild</AddButton>
          </AddImageButton>
        </ListItem>
      </WhiteBackground>
    </SettingsList>
  )
}

export default Images
