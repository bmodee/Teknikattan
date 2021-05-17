/**
 * Lets a competition creator add, remove and handle alternatives for single choice questions ("Alternativfråga") in the slide settings panel.
 *
 * @module
 */

import { ListItem, ListItemText } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonCheckedOutlined'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { QuestionAlternative } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { AddButton, AlternativeTextField, Center, Clickable, SettingsList } from '../styled'

type SingleChoiceAlternativeProps = {
  activeSlide: RichSlide
  competitionId: string
}

const SingleChoiceAlternatives = ({ activeSlide, competitionId }: SingleChoiceAlternativeProps) => {
  const dispatch = useAppDispatch()
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)

  const updateAlternativeValue = async (alternative: QuestionAlternative) => {
    if (activeSlide && activeSlide.questions[0]) {
      // Remove check from previously checked alternative
      const previousCheckedAltId = activeSlide.questions[0].alternatives.find((alt) => alt.value === 1)?.id
      if (previousCheckedAltId !== alternative.id) {
        if (previousCheckedAltId) {
          axios.put(
            `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${previousCheckedAltId}`,
            { value: 0 }
          )
        }
        // Set new checked alternative
        await axios
          .put(
            `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative.id}`,
            { value: 1 }
          )
          .then(() => {
            dispatch(getEditorCompetition(competitionId))
          })
          .catch(console.log)
      }
    }
  }

  const updateAlternativeText = async (alternative_id: number, newText: string) => {
    if (activeSlide && activeSlide.questions[0]) {
      await axios
        .put(
          `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative_id}`,
          { text: newText }
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const addAlternative = async () => {
    if (activeSlide && activeSlide.questions[0]) {
      await axios
        .post(
          `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives`,
          { text: '', value: 0 }
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const handleCloseAnswerClick = async (alternative_id: number) => {
    if (activeSlide && activeSlide.questions[0]) {
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

  const renderRadioButton = (alt: QuestionAlternative) => {
    if (alt.value) return <RadioButtonCheckedIcon onClick={() => updateAlternativeValue(alt)} />
    else return <RadioButtonUncheckedIcon onClick={() => updateAlternativeValue(alt)} />
  }

  return (
    <SettingsList>
      <ListItem divider>
        <Center>
          <ListItemText
            primary="Svarsalternativ"
            secondary="(Fyll i cirkeln höger om textfältet för att markera korrekt svar)"
          />
        </Center>
      </ListItem>
      {activeSlide &&
        activeSlide.questions[0] &&
        activeSlide.questions[0].alternatives &&
        activeSlide.questions[0].alternatives.map((alt) => (
          <div key={alt.id}>
            <ListItem divider>
              <AlternativeTextField
                id="outlined-basic"
                defaultValue={alt.text}
                onChange={(event) => updateAlternativeText(alt.id, event.target.value)}
                variant="outlined"
              />
              <Clickable>{renderRadioButton(alt)}</Clickable>
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

export default SingleChoiceAlternatives
