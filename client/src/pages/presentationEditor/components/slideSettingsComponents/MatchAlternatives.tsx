/**
 * Lets a competition creator add, remove and handle alternatives for single choice questions ("Alternativfråga") in the slide settings panel.
 *
 * @module
 */

import {
  AppBar,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import axios from 'axios'
import React, { useEffect } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { QuestionAlternative } from '../../../../interfaces/ApiModels'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { AddButton, AlternativeTextField, Center, SettingsList } from '../styled'

type SingleChoiceAlternativeProps = {
  activeSlide: RichSlide
  competitionId: string
}

interface AlternativeUpdate {
  alternative?: string
  alternative_order?: string
  correct?: string
  correct_order?: string
}

const MatchAlternatives = ({ activeSlide, competitionId }: SingleChoiceAlternativeProps) => {
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState(0)
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  // Locally stored sorted versions of alternatives to make the sorting smoother, and not have to wait on backend
  const [alternativesSortedByAlternative, setAlternativesSortedByAlternative] = React.useState<QuestionAlternative[]>(
    []
  )
  const [alternativesSortedByCorrect, setAlternativesSortedByCorrect] = React.useState<QuestionAlternative[]>([])
  useEffect(() => {
    if (!activeSlide?.questions[0].alternatives) return
    setAlternativesSortedByAlternative([
      ...activeSlide?.questions[0].alternatives.sort((a, b) => (a.alternative_order > b.alternative_order ? 1 : -1)),
    ])
    setAlternativesSortedByCorrect([
      ...activeSlide?.questions[0].alternatives.sort((a, b) => (a.correct_order > b.correct_order ? 1 : -1)),
    ])
  }, [activeSlide])

  const onDragEnd = async (result: DropResult, orderType: 'alternative_order' | 'correct_order') => {
    // dropped outside the list or same place
    if (!result.destination || result.destination.index === result.source.index) return

    const draggedIndex = result.source.index
    const draggedAlternativeId = activeSlide?.questions[0].alternatives.find((alt) => alt[orderType] === draggedIndex)
      ?.id
    if (orderType === 'alternative_order') {
      const alternativesCopy = [...alternativesSortedByAlternative]
      const [removed] = alternativesCopy.splice(draggedIndex, 1)
      alternativesCopy.splice(result.destination.index, 0, removed)
      setAlternativesSortedByAlternative(alternativesCopy)
    } else {
      const alternativesCopy = [...alternativesSortedByCorrect]
      const [removed] = alternativesCopy.splice(draggedIndex, 1)
      alternativesCopy.splice(result.destination.index, 0, removed)
      setAlternativesSortedByCorrect(alternativesCopy)
    }
    if (!draggedAlternativeId) return
    await axios
      .put(
        `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${draggedAlternativeId}`,
        {
          [orderType]: result.destination.index,
        }
      )
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  const updateAlternative = async (alternative_id: number, alternativeUpdate: AlternativeUpdate) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates filter and api 250ms after last input was made
    setTimerHandle(
      window.setTimeout(() => {
        if (activeSlide && activeSlide.questions[0]) {
          axios
            .put(
              `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives/${alternative_id}`,
              alternativeUpdate
            )
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
            })
            .catch(console.log)
        }
      }, 250)
    )
  }

  const addAlternative = async () => {
    if (activeSlide && activeSlide.questions[0]) {
      await axios
        .post(
          `/api/competitions/${competitionId}/slides/${activeSlide?.id}/questions/${activeSlide?.questions[0].id}/alternatives`
        )
        .then(() => {
          dispatch(getEditorCompetition(competitionId))
        })
        .catch(console.log)
    }
  }

  const deleteAlternative = async (alternative_id: number) => {
    if (activeSlide?.questions[0]) {
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
          <ListItemText primary="Svarsalternativ" />
        </Center>
      </ListItem>
      {activeSlide?.questions?.[0]?.alternatives?.map((alt) => (
        <div key={alt.id}>
          <ListItem divider>
            <Typography>
              {alt.alternative} | {alt.correct}
            </Typography>
          </ListItem>
        </div>
      ))}
      <Dialog
        fullWidth
        open={dialogOpen}
        onClose={() => console.log('close')}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Redigera para ihop-alternativ</DialogTitle>
        <DialogContent style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AppBar position="relative">
            <Tabs value={selectedTab} onChange={(event, selectedTab) => setSelectedTab(selectedTab)} centered>
              <Tab label="Lag" />
              <Tab label="Facit" color="primary" />
            </Tabs>
          </AppBar>

          {selectedTab === 0 && (
            <div style={{ marginBottom: 50, marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {activeSlide?.questions[0].alternatives.length !== 0 && (
                  <DialogContentText>Para ihop alternativen som de kommer se ut för lagen.</DialogContentText>
                )}
                {activeSlide?.questions[0].alternatives.length === 0 && (
                  <DialogContentText>
                    Det finns inga alternativ, lägg till alternativ med knappen nedan.
                  </DialogContentText>
                )}
              </div>
              <div style={{ display: 'flex' }}>
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'alternative_order')}>
                  <div style={{ flexDirection: 'column' }}>
                    <Droppable droppableId="droppable1">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {alternativesSortedByAlternative.map((alternative, index) => (
                            <Draggable draggableId={alternative.id.toString()} index={index} key={alternative.id}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Card elevation={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <DragIndicatorIcon elevation={3} />
                                    <AlternativeTextField
                                      id="outlined-basic"
                                      defaultValue={alternative.alternative}
                                      onChange={(event) =>
                                        updateAlternative(alternative.id, { alternative: event.target.value })
                                      }
                                      variant="outlined"
                                      style={{ width: 200 }}
                                    />
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </DragDropContext>

                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'correct_order')}>
                  <div style={{ flexDirection: 'column' }}>
                    <Droppable droppableId="droppable2">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {alternativesSortedByCorrect.map((alternative, index) => (
                            <Draggable draggableId={alternative.id.toString()} index={index} key={alternative.id}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Card elevation={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <AlternativeTextField
                                      id="outlined-basic"
                                      defaultValue={alternative.correct}
                                      onChange={(event) =>
                                        updateAlternative(alternative.id, { correct: event.target.value })
                                      }
                                      variant="outlined"
                                    />
                                    <DragIndicatorIcon elevation={3} />
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </DragDropContext>
              </div>
            </div>
          )}

          {selectedTab === 1 && (
            <div style={{ marginBottom: 50, marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {activeSlide?.questions[0].alternatives.length !== 0 && (
                  <DialogContentText>Editera svarsalternativen.</DialogContentText>
                )}
                {activeSlide?.questions[0].alternatives.length === 0 && (
                  <DialogContentText>
                    Det finns inga alternativ, lägg till alternativ med knappen nedan.
                  </DialogContentText>
                )}
              </div>
              {activeSlide?.questions?.[0]?.alternatives?.map((alternative, index) => (
                <div style={{ display: 'flex' }} key={alternative.id}>
                  <Card elevation={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small" onClick={() => deleteAlternative(alternative.id)}>
                      <ClearIcon color="error" />
                    </IconButton>
                    <AlternativeTextField
                      id="outlined-basic"
                      defaultValue={alternative.alternative}
                      onChange={(event) => updateAlternative(alternative.id, { alternative: event.target.value })}
                      variant="outlined"
                      style={{ width: 200 }}
                    />
                  </Card>
                  <Card elevation={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <AlternativeTextField
                      id="outlined-basic"
                      defaultValue={alternative.correct}
                      onChange={(event) => updateAlternative(alternative.id, { correct: event.target.value })}
                      variant="outlined"
                      style={{ width: 200 }}
                    />
                  </Card>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" autoFocus onClick={addAlternative} color="primary">
            Lägg till alternativ
          </Button>
          <Button variant="contained" autoFocus onClick={() => setDialogOpen(false)} color="secondary">
            Stäng
          </Button>
        </DialogActions>
      </Dialog>
      <ListItem button onClick={() => setDialogOpen(true)}>
        <Center>
          <AddButton variant="button">Redigera alternativ</AddButton>
        </Center>
      </ListItem>
    </SettingsList>
  )
}

export default MatchAlternatives
