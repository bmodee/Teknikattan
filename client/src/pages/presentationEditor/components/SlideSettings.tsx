/* This file compiles and renders the right hand slide settings bar, under the tab "SIDA".
 */
import { Divider, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../hooks'
import Alternatives from './Alternatives'
import SlideType from './SlideType'
import { Center, ImportedImage, SettingsList, SlidePanel } from './styled'
import Timer from './Timer'
import Images from './Images'
import Texts from './Texts'

interface CompetitionParams {
  id: string
}

const SlideSettings: React.FC = () => {
  const { id }: CompetitionParams = useParams()

  const activeSlide = useAppSelector((state) =>
    // Gets the slide with id=activeSlideId from the database.
    state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)
  )

  return (
    <SlidePanel>
      <SettingsList>
        {activeSlide && <SlideType activeSlide={activeSlide} competitionId={id} />}
        <Divider />
        {activeSlide && <Timer activeSlide={activeSlide} competitionId={id} />}
      </SettingsList>

      {activeSlide && <Alternatives activeSlide={activeSlide} competitionId={id} />}

      {activeSlide && <Texts activeSlide={activeSlide} competitionId={id} />}

      {activeSlide && <Images activeSlide={activeSlide} competitionId={id} />}

      <SettingsList>
        <ListItem button>
          <ImportedImage
            id="temp source, todo: add image source to elements of pictureList"
            src="https://i1.wp.com/stickoutmedia.se/wp-content/uploads/2021/01/placeholder-3.png?ssl=1"
          />
          <Center>
            <ListItemText>Välj bakgrundsbild ...</ListItemText>
          </Center>
        </ListItem>
      </SettingsList>
    </SlidePanel>
  )
}

export default SlideSettings
