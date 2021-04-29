import { Divider, ListItem, ListItemText, Typography } from '@material-ui/core'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { TextComponent } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { AddButton, Center, SettingsList, TextCard } from '../styled'
import TextComponentEdit from '../TextComponentEdit'
import axios from 'axios'
import { getEditorCompetition } from '../../../../actions/editor'

type TextsProps = {
  activeViewTypeId: number
  activeSlide: RichSlide
  competitionId: string
}

const Texts = ({ activeViewTypeId, activeSlide, competitionId }: TextsProps) => {
  const texts = useAppSelector(
    (state) =>
      state.editor.competition.slides
        .find((slide) => slide.id === state.editor.activeSlideId)
        ?.components.filter((component) => component.type_id === 1) as TextComponent[]
  )

  const dispatch = useAppDispatch()
  const handleAddText = async () => {
    if (activeSlide) {
      await axios.post(`/api/competitions/${competitionId}/slides/${activeSlide?.id}/components`, {
        type_id: 1,
        text: 'Ny text',
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
      {texts &&
        texts
          .filter((text) => text.view_type_id === activeViewTypeId)
          .map((text) => (
            <TextCard elevation={4} key={text.id}>
              <TextComponentEdit component={text} />
              <Divider />
            </TextCard>
          ))}
      <ListItem button onClick={handleAddText}>
        <Center>
          <AddButton variant="button">Lägg till text</AddButton>
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default Texts