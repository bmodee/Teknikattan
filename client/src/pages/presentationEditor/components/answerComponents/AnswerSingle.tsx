/**
 * What it is:
 * Contains the component for the single choice question type ("Alternativfråga")
 * which is displayed in the participant view in the editor and presentation.
 * This is a part of a question component which the users will interact with to answer multiple choice questions.
 * The participants get multiple alternatives but can only mark one of these alternatives as correct.
 *
 * How it's used:
 * This file is used when a question component is to be rendered which only happens in QuestionComponentDisplay.tsx.
 * For more information read the documentation of that file.
 *
 * @module
 */

import { ListItem, ListItemText, Typography } from '@material-ui/core'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonCheckedOutlined'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { getPresentationCompetition } from '../../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { QuestionAlternative } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, Clickable } from '../styled'

type AnswerSingleProps = {
  variant: 'editor' | 'presentation'
  activeSlide: RichSlide | undefined
  competitionId: string
}

const AnswerSingle = ({ variant, activeSlide, competitionId }: AnswerSingleProps) => {
  const dispatch = useAppDispatch()
  const teamId = useAppSelector((state) => state.competitionLogin.data?.team_id)
  const team = useAppSelector((state) => {
    if (variant === 'editor') return state.editor.competition.teams.find((team) => team.id === teamId)
    return state.presentation.competition.teams.find((team) => team.id === teamId)
  })
  const timer = useAppSelector((state) => state.presentation.timer)

  const decideChecked = (alternative: QuestionAlternative) => {
    const answer = team?.question_alternative_answers.find(
      (questionAnswer) => questionAnswer.question_alternative_id == alternative.id
    )
    if (answer) {
      return answer.answer === '1'
    }
    return false
  }

  const updateAnswer = async (alternative: QuestionAlternative) => {
    if (!activeSlide || (activeSlide?.timer !== undefined && !timer.enabled)) {
      return
    }

    // Unselect each radio button to only allow one selected alternative
    const alternatives = activeSlide.questions[0].alternatives
    for (const alt of alternatives) {
      const url = `/api/competitions/${competitionId}/teams/${teamId}/answers/question_alternatives/${alt.id}`
      await axios.put(url, { answer: 0 })
    }
    // Update selected alternative
    const url = `/api/competitions/${competitionId}/teams/${teamId}/answers/question_alternatives/${alternative.id}`
    await axios
      .put(url, { answer: 1 })
      .then(() => {
        if (variant === 'editor') {
          dispatch(getEditorCompetition(competitionId))
        } else {
          dispatch(getPresentationCompetition(competitionId))
        }
      })
      .catch(console.log)
  }

  /**
   * Renders the radio button which the participants will click to mark their answer.
   */
  const renderRadioButton = (alt: QuestionAlternative) => {
    let disabledStyle
    if (activeSlide?.timer !== undefined && !timer.enabled) {
      disabledStyle = { fill: '#AAAAAA' } // Buttons are light grey if  timer is not on
    }
    if (variant === 'presentation') {
      if (decideChecked(alt)) {
        return (
          <Clickable>
            <RadioButtonCheckedIcon style={disabledStyle} onClick={() => updateAnswer(alt)} />
          </Clickable>
        )
      } else {
        return (
          <Clickable>
            <RadioButtonUncheckedIcon style={disabledStyle} onClick={() => updateAnswer(alt)} />
          </Clickable>
        )
      }
    } else {
      return <RadioButtonUncheckedIcon style={disabledStyle} onClick={() => updateAnswer(alt)} />
    }
  }

  return (
    <div>
      <ListItem divider>
        <Center>
          <ListItemText primary="Välj ett svar:" />
        </Center>
      </ListItem>
      {activeSlide &&
        activeSlide.questions[0] &&
        activeSlide.questions[0].alternatives &&
        activeSlide.questions[0].alternatives.map((alt) => (
          <div key={alt.id}>
            <ListItem divider>
              {renderRadioButton(alt)}
              <Typography style={{ wordBreak: 'break-all' }}>{alt.alternative}</Typography>
            </ListItem>
          </div>
        ))}
    </div>
  )
}

export default AnswerSingle
