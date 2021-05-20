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

import { ListItemText, Typography } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getPresentationCompetition } from '../../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { QuestionAlternative } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, Clickable } from '../styled'
import { MatchButtonContainer, MatchCard, MatchContainer, MatchCorrectContainer, MatchIconContainer } from './styled'

type AnswerMultipleProps = {
  variant: 'editor' | 'presentation'
  activeSlide: RichSlide | undefined
  competitionId: string
}

const AnswerMatch = ({ variant, activeSlide, competitionId }: AnswerMultipleProps) => {
  const dispatch = useAppDispatch()
  const teamId = useAppSelector((state) => state.competitionLogin.data?.team_id)
  const [sortedAlternatives, setSortedAlternatives] = useState<QuestionAlternative[]>([])
  const [sortedAnswers, setSortedAnswers] = useState<QuestionAlternative[]>([])
  const team = useAppSelector((state) => state.presentation.competition.teams.find((team) => team.id === teamId))

  useEffect(() => {
    if (activeSlide) {
      setSortedAlternatives([
        ...activeSlide.questions[0].alternatives.sort((a, b) => (a.alternative_order > b.alternative_order ? 1 : -1)),
      ])
      setSortedAnswers([
        ...activeSlide.questions[0].alternatives.sort((a, b) => (a.correct_order > b.correct_order ? 1 : -1)),
      ])
    }
  }, [activeSlide])

  useEffect(() => {
    // Send the standard answers ( if the team choses to not move one of the answers )
    if (teamId && team?.question_alternative_answers.length === 0) {
      activeSlide?.questions[0].alternatives.forEach((alternative) => {
        const answer = activeSlide?.questions[0].alternatives.find(
          (alt) => alternative.alternative_order === alt.correct_order
        )
        axios
          .put(`/api/competitions/${competitionId}/teams/${teamId}/answers/question_alternatives/${alternative.id}`, {
            answer: `${alternative.alternative} - ${answer?.correct}`,
          })
          .then(() => {
            dispatch(getPresentationCompetition(competitionId))
          })
          .catch(console.log)
      })
    }
  }, [teamId])

  const onMove = async (previousIndex: number, resultIndex: number) => {
    // moved outside the list
    if (resultIndex < 0 || resultIndex >= sortedAnswers.length || variant !== 'presentation') return
    const answersCopy = [...sortedAnswers]
    const [removed] = answersCopy.splice(previousIndex, 1)
    answersCopy.splice(resultIndex, 0, removed)
    setSortedAnswers(answersCopy)

    sortedAlternatives.forEach((alternative, index) => {
      const answeredText = answersCopy[index].correct
      if (!activeSlide) return
      axios
        .put(`/api/competitions/${competitionId}/teams/${teamId}/answers/question_alternatives/${alternative.id}`, {
          answer: `${alternative.alternative} - ${answeredText}`,
        })
        .catch(console.log)
    })
  }

  return (
    <>
      <Center>
        <ListItemText secondary="Para ihop de alternativ som hör ihop:" />
      </Center>
      <MatchContainer>
        <div style={{ flexDirection: 'column', marginRight: 20 }}>
          {sortedAlternatives.map((alternative, index) => (
            <MatchCard key={alternative.id} elevation={4}>
              <Typography id="outlined-basic">{alternative.alternative}</Typography>
            </MatchCard>
          ))}
        </div>

        <div style={{ flexDirection: 'column', marginRight: 20 }}>
          {sortedAlternatives.map((alternative, index) => (
            <MatchIconContainer key={alternative.id}>
              <SyncAltIcon />
            </MatchIconContainer>
          ))}
        </div>

        <div style={{ flexDirection: 'column' }}>
          {sortedAnswers.map((alternative, index) => (
            <MatchCard key={alternative.id} elevation={4}>
              <MatchCorrectContainer>
                <Typography id="outlined-basic">{alternative.correct}</Typography>
              </MatchCorrectContainer>
              <MatchButtonContainer>
                <Clickable>
                  <KeyboardArrowUpIcon onClick={() => onMove(index, index - 1)} />
                </Clickable>
                <Clickable>
                  <KeyboardArrowDownIcon onClick={() => onMove(index, index + 1)} />
                </Clickable>
              </MatchButtonContainer>
            </MatchCard>
          ))}
        </div>
      </MatchContainer>
    </>
  )
}

export default AnswerMatch
