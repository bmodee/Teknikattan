import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../hooks'
import { RichTeam } from '../../../interfaces/ApiRichModels'
import { socketSync } from '../../../sockets'
import { Center } from '../../presentationEditor/components/styled'

type ScoreboardProps = {
  isOperator?: boolean
}

const Scoreboard = ({ isOperator }: ScoreboardProps) => {
  const teams = useAppSelector((state) => state.presentation.competition.teams)

  /** Sums the scores for the teams. */
  const addScore = (team: RichTeam) => {
    let totalScore = 0
    for (let j = 0; j < team.question_scores.length; j++) {
      totalScore = totalScore + team.question_scores[j].score
    }
    return totalScore
  }

  return (
    <Dialog open aria-labelledby="max-width-dialog-title" maxWidth="xl">
      <Center>
        <DialogTitle id="max-width-dialog-title" style={{ width: '100%' }}>
          <h1>Ställning</h1>
        </DialogTitle>
      </Center>
      <DialogContent>
        {(!teams || teams.length === 0) && 'Det finns inga lag i denna tävling'}
        <List>
          {teams &&
            teams
              .sort((a, b) => (addScore(a) < addScore(b) ? 1 : 0))
              .map((team) => (
                <ListItem key={team.id}>
                  <ListItemText primary={team.name} />
                  <ListItemText
                    primary={`${addScore(team)} poäng`}
                    style={{ textAlign: 'right', marginLeft: '25px' }}
                  />
                </ListItem>
              ))}
        </List>
      </DialogContent>

      {isOperator && (
        <DialogActions>
          <Button onClick={() => socketSync({ show_scoreboard: false })} color="primary">
            Stäng
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default Scoreboard
