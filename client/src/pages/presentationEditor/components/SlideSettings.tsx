/* This file compiles and renders the right hand slide settings bar, under the tab "SIDA".
 */
import { Divider, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../hooks'
import Instructions from './slideSettingsComponents/Instructions'
import MultipleChoiceAlternatives from './slideSettingsComponents/MultipleChoiceAlternatives'
import SlideType from './slideSettingsComponents/SlideType'
import { Center, ImportedImage, SettingsList, PanelContainer } from './styled'
import Timer from './slideSettingsComponents/Timer'
import Images from './slideSettingsComponents/Images'
import Texts from './slideSettingsComponents/Texts'
import QuestionSettings from './slideSettingsComponents/QuestionSettings'

interface CompetitionParams {
  competitionId: string
}

const SlideSettings: React.FC = () => {
  const { competitionId }: CompetitionParams = useParams()

  const activeSlide = useAppSelector((state) =>
    // Gets the slide with id=activeSlideId from the database.
    state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)
  )

  return (
    <PanelContainer>
      <SettingsList>
        {activeSlide && <SlideType activeSlide={activeSlide} competitionId={competitionId} />}
        <Divider />
        {activeSlide && <Timer activeSlide={activeSlide} competitionId={competitionId} />}
      </SettingsList>

      {activeSlide?.questions[0] && <QuestionSettings activeSlide={activeSlide} competitionId={competitionId} />}
      {
        // Choose answer alternatives depending on the slide type
      }
      {activeSlide?.questions[0]?.type_id === 1 && (
        <Instructions activeSlide={activeSlide} competitionId={competitionId} />
      )}
      {activeSlide?.questions[0]?.type_id === 2 && (
        <Instructions activeSlide={activeSlide} competitionId={competitionId} />
      )}
      {activeSlide?.questions[0]?.type_id === 3 && (
        <MultipleChoiceAlternatives activeSlide={activeSlide} competitionId={competitionId} />
      )}

      {activeSlide && <Texts activeSlide={activeSlide} competitionId={competitionId} />}

      {activeSlide && <Images activeSlide={activeSlide} competitionId={competitionId} />}

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
    </PanelContainer>
  )
}

export default SlideSettings
