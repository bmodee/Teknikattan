/**
 * This file contains the Texts function, which returns a component containing text components.
 * This component is used to edit and add text components in a slide.
 * It is used in SlideSettings.
 */
import { Divider, ListItem, ListItemText } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { TextComponent } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { AddButton, Center, SettingsList, TextCard } from '../styled'
import TextComponentEdit from '../TextComponentEdit'

type TextsProps = {
  activeViewTypeId: number
  activeSlide: RichSlide
  competitionId: string
}

/** Creates and renders a texts component */
const Texts = ({ activeViewTypeId, activeSlide, competitionId }: TextsProps) => {
  /** Gets all text components from the slide state */
  const texts = useAppSelector(
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 1) as TextComponent[]
  )

  const dispatch = useAppDispatch()

  /** Adds a new text component to the slide using API call */
  const handleAddText = async () => {
    if (activeSlide) {
      await axios.post(`/api/competitions/${competitionId}/slides/${activeSlide?.id}/components`, {
        type_id: 1,
        text: '<p><span style="font-size: 24pt;">Ny text</span></p>',
        w: 315,
        h: 50,
        view_type_id: activeViewTypeId,
      })
      dispatch(getEditorCompetition(competitionId))
    }
  }

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText primary="Text" />
        </Center>
      </ListItem>
      {/** Shows list of all text components in the slide */}
      {texts &&
        texts
          .filter((text) => text.view_type_id === activeViewTypeId)
          .map((text) => (
            <TextCard elevation={4} key={text.id}>
              <TextComponentEdit component={text} />
              <Divider />
            </TextCard>
          ))}
      {/** Button to create new text component */}
      <ListItem button onClick={handleAddText}>
        <Center>
          <AddButton variant="button">Lägg till text</AddButton>
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default Texts
