/**
 * What it is:
 * Contains the component for the multiple choice question type ("Kryssfråga")
 * which is displayed in the participant view in the editor and presentation.
 * This is a part of a question component which the users will interact with to answer multiple choice questions.
 * The participants get multiple alternatives and can mark multiple of these alternatives as correct.
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
import axios from 'axios'
import React from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { getPresentationCompetition } from '../../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { QuestionAlternative } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center } from '../styled'

type AnswerMultipleProps = {
  variant: 'editor' | 'presentation'
  activeSlide: RichSlide | undefined
  competitionId: string
}

const AnswerMultiple = ({ variant, activeSlide, competitionId }: AnswerMultipleProps) => {
  const dispatch = useAppDispatch()
  const teamId = useAppSelector((state) => state.competitionLogin.data?.team_id)
  const team = useAppSelector((state) => state.presentation.competition.teams.find((team) => team.id === teamId))

  const decideChecked = (alternative: QuestionAlternative) => {
    const answer = team?.question_alternative_answers.find(
      (questionAnswer) => questionAnswer.question_alternative_id == alternative.id
    )
    if (answer) {
      return answer.answer === '1'
    }
    return false
  }

  const updateAnswer = async (alternative: QuestionAlternative, checked: boolean) => {
    // TODO: fix. Make list of alternatives and delete & post instead of put to allow multiple boxes checked.
    if (!activeSlide) {
      return
    }
    const url = `/api/competitions/${competitionId}/teams/${teamId}/answers/question_alternatives/${alternative.id}`
    const payload = {
      answer: checked ? 1 : 0,
    }
    await axios
      .put(url, payload)
      .then(() => {
        if (variant === 'editor') {
          dispatch(getEditorCompetition(competitionId))
        } else {
          dispatch(getPresentationCompetition(competitionId))
        }
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

  return (
    <div>
      <ListItem divider>
        <Center>
          <ListItemText primary="Välj ett eller flera svar:" />
        </Center>
      </ListItem>
      {activeSlide &&
        activeSlide.questions[0] &&
        activeSlide.questions[0].alternatives &&
        activeSlide.questions[0].alternatives.map((alt) => (
          <div key={alt.id}>
            <ListItem divider>
              <GreenCheckbox
                checked={decideChecked(alt)}
                onChange={(event: any) => updateAnswer(alt, event.target.checked)}
              />
              <Typography style={{ wordBreak: 'break-all' }}>{alt.alternative}</Typography>
            </ListItem>
          </div>
        ))}
    </div>
  )
}

export default AnswerMultiple
