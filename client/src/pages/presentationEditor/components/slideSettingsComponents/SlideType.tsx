import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import axios from 'axios'
import React, { useState } from 'react'
import { getEditorCompetition } from '../../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { RichSlide } from '../../../../interfaces/ApiRichModels'
import { Center, FirstItem } from '../styled'

type SlideTypeProps = {
  activeSlide: RichSlide
  competitionId: string
}

const SlideType = ({ activeSlide, competitionId }: SlideTypeProps) => {
  const dispatch = useAppDispatch()

  // For "slide type" dialog
  const [selectedSlideType, setSelectedSlideType] = useState(0)
  const [slideTypeDialog, setSlideTypeDialog] = useState(false)
  const components = useAppSelector(
    (state) => state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)?.components
  )
  const questionComponentId = components?.find((qCompId) => qCompId.type_id === 3)?.id

  const openSlideTypeDialog = (type_id: number) => {
    setSelectedSlideType(type_id)
    setSlideTypeDialog(true)
  }
  const closeSlideTypeDialog = () => {
    setSlideTypeDialog(false)
  }

  const updateSlideType = async () => {
    closeSlideTypeDialog()
    if (activeSlide) {
      if (activeSlide.questions?.[0] && activeSlide.questions[0].type_id !== selectedSlideType) {
        deleteQuestionComponent(questionComponentId)
        if (selectedSlideType === 0) {
          // Change slide type from a question type to information
          await axios
            .delete(
              `/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`
            )
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
            })
            .catch(console.log)
        } else {
          // Change slide type from question type to another question type
          await axios
            .delete(
              `/api/competitions/${competitionId}/slides/${activeSlide.id}/questions/${activeSlide.questions[0].id}`
            )
            .catch(console.log)
          await axios
            .post(`/api/competitions/${competitionId}/slides/${activeSlide.id}/questions`, {
              name: 'Ny fråga',
              total_score: 0,
              type_id: selectedSlideType,
            })
            .then(() => {
              dispatch(getEditorCompetition(competitionId))
              createQuestionComponent()
            })
            .catch(console.log)
        }
      } else if (selectedSlideType !== 0) {
        // Change slide type from information to a question type
        await axios
          .post(`/api/competitions/${competitionId}/slides/${activeSlide.id}/questions`, {
            name: 'Ny fråga',
            total_score: 0,
            type_id: selectedSlideType,
          })
          .then(() => {
            dispatch(getEditorCompetition(competitionId))
            createQuestionComponent()
          })
          .catch(console.log)
      }
    }
  }

  const createQuestionComponent = () => {
    axios
      .post(`/api/competitions/${competitionId}/slides/${activeSlide.id}/components`, {
        x: 0,
        y: 0,
        w: 400,
        h: 250,
        type_id: 3,
        view_type_id: 1,
        question_id: activeSlide.questions[0].id,
      })
      .then(() => {
        dispatch(getEditorCompetition(competitionId))
      })
      .catch(console.log)
  }

  const deleteQuestionComponent = (componentId: number | undefined) => {
    if (componentId) {
      axios
        .delete(`/api/competitions/${competitionId}/slides/${activeSlide.id}/components/${componentId}`)
        .catch(console.log)
    }
  }

  return (
    <FirstItem>
      <ListItem>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Sidtyp</InputLabel>
          <Select fullWidth={true} value={activeSlide?.questions?.[0]?.type_id || 0} label="Sidtyp">
            <MenuItem value={0}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(0)}>
                Informationssida
              </Typography>
            </MenuItem>
            <MenuItem value={1}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(1)}>
                Skriftlig fråga
              </Typography>
            </MenuItem>
            <MenuItem value={2}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(2)}>
                Praktisk fråga
              </Typography>
            </MenuItem>
            <MenuItem value={3}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(3)}>
                Kryssfråga
              </Typography>
            </MenuItem>
            <MenuItem value={4}>
              <Typography variant="button" onClick={() => openSlideTypeDialog(4)}>
                Alternativfråga
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>

        <Dialog open={slideTypeDialog} onClose={closeSlideTypeDialog}>
          <Center>
            <DialogTitle color="secondary">Varning!</DialogTitle>
          </Center>
          <DialogContent>
            <DialogContentText>
              Om du ändrar sidtypen kommer eventuella frågeinställningar gå förlorade. Det inkluderar: frågans namn,
              poäng och svarsalternativ.{' '}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeSlideTypeDialog} color="secondary">
              Avbryt
            </Button>
            <Button onClick={updateSlideType} color="primary">
              Bekräfta
            </Button>
          </DialogActions>
        </Dialog>
      </ListItem>
    </FirstItem>
  )
}

export default SlideType
