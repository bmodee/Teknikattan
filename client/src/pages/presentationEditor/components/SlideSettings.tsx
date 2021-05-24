/**
 * This file contains the SlideSettings function, which returns the right hand slide settings bar.
 * This component is used to edit settings associated to a slide, such as question, image and text components.
 */
import { Divider } from '@material-ui/core'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../hooks'
import BackgroundImageSelect from './BackgroundImageSelect'
import Images from './slideSettingsComponents/Images'
import Instructions from './slideSettingsComponents/Instructions'
import MatchAlternatives from './slideSettingsComponents/MatchAlternatives'
import MultipleChoiceAlternatives from './slideSettingsComponents/MultipleChoiceAlternatives'
import QuestionSettings from './slideSettingsComponents/QuestionSettings'
import SingleChoiceAlternatives from './slideSettingsComponents/SingleChoiceAlternatives'
import SlideType from './slideSettingsComponents/SlideType'
import Texts from './slideSettingsComponents/Texts'
import Timer from './slideSettingsComponents/Timer'
import { PanelContainer, SettingsList } from './styled'

interface CompetitionParams {
  competitionId: string
}

/** Creates and renders the slide settings component */
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
        {activeSlide && Boolean(activeSlide.questions[0]) && (
          <Timer activeSlide={activeSlide} competitionId={competitionId} />
        )}
      </SettingsList>

      {activeSlide?.questions[0] && <QuestionSettings activeSlide={activeSlide} competitionId={competitionId} />}

      {
        // Choose answer alternatives, depending on the slide type
      }
      {(activeSlide?.questions[0]?.type_id === 1 || activeSlide?.questions[0]?.type_id === 2) && (
        <Instructions activeSlide={activeSlide} competitionId={competitionId} />
      )}
      {activeSlide?.questions[0]?.type_id === 3 && (
        <MultipleChoiceAlternatives activeSlide={activeSlide} competitionId={competitionId} />
      )}

      {activeSlide?.questions[0]?.type_id === 4 && (
        <SingleChoiceAlternatives activeSlide={activeSlide} competitionId={competitionId} />
      )}

      {activeSlide?.questions[0]?.type_id === 5 && (
        <MatchAlternatives activeSlide={activeSlide} competitionId={competitionId} />
      )}

      {/** Text components */}
      {activeSlide && (
        <Texts activeViewTypeId={activeViewTypeId} activeSlide={activeSlide} competitionId={competitionId} />
      )}

      {/** Image components */}
      {activeSlide && (
        <Images activeViewTypeId={activeViewTypeId} activeSlide={activeSlide} competitionId={competitionId} />
      )}

      <BackgroundImageSelect variant="slide" />
    </PanelContainer>
  )
}

export default SlideSettings
