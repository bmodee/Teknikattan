/**
 * Lets a competition creator add, remove and handle alternatives for multiple choice questions ("Kryssfråga") in the slide settings panel.
 *
 * @module
 */

import { Checkbox, ListItem, ListItemText, withStyles } from '@material-ui/core'
import { CheckboxProps } from '@material-ui/core/Checkbox'
import { green, grey } from '@material-ui/core/colors'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { QuestionAlternative } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { AddButton, AlternativeTextField, Center, Clickable, SettingsList } from '../styled'

type MultipleChoiceAlternativeProps = {
  activeSlide: RichSlide
  competitionId: string
}

const MultipleChoiceAlternatives = ({ activeSlide, competitionId }: MultipleChoiceAlternativeProps) => {
  const dispatch = useAppDispatch()
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)

  const GreenCheckbox = withStyles({
    root: {
      color: grey[900],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />)

  /**
   * A checked checkbox is represented with 1 and an unchecked with 0.
   */
  const stringToBool = (num: string) => {
    if (num === '0') return false
    else return true
  }

  const updateAlternativeValue = async (alternative: QuestionAlternative) => {
    if (activeSlide && activeSlide.questions?.[0]) {
      let newValue: string
      if (alternative.correct === '0') {
        newValue = '1'
      } else newValue = '0'
      await axios        .put(
          `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative.id}`,
          { correct: newValue }
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const updateAlternativeText = async (alternative_id: number, newText: string) => {
    if (activeSlide && activeSlide.questions?.[0]) {
      await axios
        .put(
          `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative_id}`,
          { alternative: newText }
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const addAlternative = async () => {
    if (activeSlide && activeSlide.questions?.[0]) {
      await axios
        .post(
          `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives`,
          { correct: '0' }
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const handleCloseAnswerClick = async (alternative_id: number) => {
    if (activeSlide && activeSlide.questions?.[0]) {
      await axios
        .delete(
          `/api/competitions/${competitionId}/slides/${activeSlideId}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative_id}`
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText
            primary="Svarsalternativ"
            secondary="(Fyll i rutan höger om textfältet för att markera korrekt svar)"
          />
        </Center>
      </ListItem>
      {activeSlide?.questions?.[0]?.alternatives?.map((alt) => (
        <div key={alt.id}>
          <ListItem divider>
            <AlternativeTextField
              id="outlined-basic"
              defaultValue={alt.alternative}
              onChange={(event) => updateAlternativeText(alt.id, event.target.value)}
              variant="outlined"
            />
            <GreenCheckbox checked={stringToBool(alt.correct)} onChange={() => updateAlternativeValue(alt)} />
            <Clickable>
              <CloseIcon onClick={() => handleCloseAnswerClick(alt.id)} />
            </Clickable>
          </ListItem>
        </div>
      ))}
      <ListItem button onClick={addAlternative}>
        <Center>
          <AddButton variant="button">Lägg till svarsalternativ</AddButton>
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default MultipleChoiceAlternatives
