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

import { Checkbox, ListItem, ListItemText, Typography, withStyles } from '@material-ui/core'
import { CheckboxProps } from '@material-ui/core/Checkbox'
import { green, grey } from '@material-ui/core/colors'
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
  const answerId = team?.question_answers.find((answer) => answer.question_id === activeSlide?.questions[0].id)?.id

  const decideChecked = (alternative: QuestionAlternative) => {
    const teamAnswer = team?.question_answers.find((answer) => answer.answer === alternative.text)?.answer
    if (teamAnswer) return true
    else return false
  }

  const updateAnswer = async (alternative: QuestionAlternative) => {
    if (activeSlide) {
      if (team?.question_answers[0]) {
        // If an alternative was already marked
        await axios
          .put(`/api/competitions/${competitionId}/teams/${teamId}/answers/${answerId}`, {
            answer: alternative.text,
          })
          .then(() => {
            if (variant === 'editor') {
              dispatch(getEditorCompetition(competitionId))
            } else {
              dispatch(getPresentationCompetition(competitionId))
            }
          })
          .catch(console.log)
      } else {
        // If no alternative was already marked
        await axios
          .post(`/api/competitions/${competitionId}/teams/${teamId}/answers`, {
            answer: alternative.text,
            score: 0,
            question_id: activeSlide.questions[0].id,
          })
          .then(() => {
            if (variant === 'editor') {
              dispatch(getEditorCompetition(competitionId))
            } else {
              dispatch(getPresentationCompetition(competitionId))
            }
          })
          .catch(console.log)
      }
    }
  }

  const deleteAnswer = async () => {
    await axios
      .delete(`/api/competitions/${competitionId}/teams/${teamId}/answers`)
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

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
   * Renders the radio button which the participants will click to mark their answer.
   */
  const renderRadioButton = (alt: QuestionAlternative) => {
    if (variant === 'presentation') {
      if (decideChecked(alt)) {
        return (
          <Clickable>
            <RadioButtonCheckedIcon onClick={() => updateAnswer(alt)} />
          </Clickable>
        )
      } else {
        return (
          <Clickable>
            <RadioButtonUncheckedIcon onClick={() => updateAnswer(alt)} />
          </Clickable>
        )
      }
    } else {
      return <RadioButtonUncheckedIcon onClick={() => updateAnswer(alt)} />
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
              <Typography style={{ wordBreak: 'break-all' }}>{alt.text}</Typography>
            </ListItem>
          </div>
        ))}
    </div>
  )
}

export default AnswerSingle
