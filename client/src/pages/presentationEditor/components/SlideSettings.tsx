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
import BackgroundImageSelect from './BackgroundImageSelect'

interface CompetitionParams {
  competitionId: string
}

const SlideSettings: React.FC = () => {
  const { competitionId }: CompetitionParams = useParams()

  const activeSlide = useAppSelector((state) =>
    // Gets the slide with id=activeSlideId from the database.
    state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)
  )
  const activeViewTypeId = useAppSelector((state) => state.editor.activeViewTypeId)

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

      {activeSlide && (
        <Texts activeViewTypeId={activeViewTypeId} activeSlide={activeSlide} competitionId={competitionId} />
      )}

      {activeSlide && (
        <Images activeViewTypeId={activeViewTypeId} activeSlide={activeSlide} competitionId={competitionId} />
      )}

      <BackgroundImageSelect variant="slide" />
    </PanelContainer>
  )
}

export default SlideSettings
