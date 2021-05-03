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
  const answer = team?.question_answers.find((answer) => answer.question_id === activeSlide?.questions[0].id)

  const decideChecked = (alternative: QuestionAlternative) => {
    const teamAnswer = team?.question_answers.find((answer) => answer.answer === alternative.text)?.answer
    if (alternative.text === teamAnswer) return true
    else return false
  }

  const updateAnswer = async (alternative: QuestionAlternative) => {
    // TODO: fix. Make list of alternatives and delete & post instead of put to allow multiple boxes checked.
    if (activeSlide) {
      if (team?.question_answers.find((answer) => answer.question_id === activeSlide.questions[0].id)) {
        if (answer?.answer === alternative.text) {
          // Uncheck checkbox
          deleteAnswer()
        } else {
          // Check another box
          // TODO
        }
      } else {
        // Check first checkbox
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
      .delete(`/api/competitions/${competitionId}/teams/${teamId}/answers`) // TODO: fix
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
              {
                //<GreenCheckbox checked={checkbox} onChange={(event) => updateAnswer(alt, event.target.checked)} />
              }
              <GreenCheckbox checked={decideChecked(alt)} onChange={() => updateAnswer(alt)} />
              <Typography style={{ wordBreak: 'break-all' }}>{alt.text}</Typography>
            </ListItem>
          </div>
        ))}
    </div>
  )
}

export default AnswerMultiple
