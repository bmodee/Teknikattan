import { Divider, List, ListItemText, Snackbar, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { getPresentationCompetition } from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { RichSlide } from '../../interfaces/ApiRichModels'
import { socketConnect } from '../../sockets'
import { renderSlideIcon } from '../../utils/renderSlideIcon'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { SlideListItem } from '../presentationEditor/styled'
import JudgeScoreDisplay from './components/JudgeScoreDisplay'
import JudgeScoringInstructions from './components/JudgeScoringInstructions'
import {
  Content,
  InnerContent,
  JudgeAnswersLabel,
  JudgeAppBar,
  JudgeQuestionsLabel,
  JudgeToolbar,
  LeftDrawer,
  RightDrawer,
  ScoreFooterPadding,
  ScoreHeaderPadding,
  ScoreHeaderPaper,
} from './styled'

const leftDrawerWidth = 150
const rightDrawerWidth = 700

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    leftDrawerPaper: {
      width: leftDrawerWidth,
    },
    rightDrawerPaper: {
      width: rightDrawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  })
)

const JudgeViewPage: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const code = useAppSelector((state) => state.presentation.code)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Team')?.id
  const teams = useAppSelector((state) => state.presentation.competition.teams)
  const slides = useAppSelector((state) => state.presentation.competition.slides)
  const [successMessageOpen, setSuccessMessageOpen] = useState(true)
  const competitionName = useAppSelector((state) => state.presentation.competition.name)
  const [currentSlide, setCurrentSlide] = useState<RichSlide | undefined>(undefined)
  const currentQuestion = currentSlide?.questions[0]
  const operatorActiveSlideId = useAppSelector((state) => state.presentation.activeSlideId)
  const timer = useAppSelector((state) => state.presentation.timer)
  const operatorActiveSlideOrder = useAppSelector(
    (state) => state.presentation.competition.slides.find((slide) => slide.id === operatorActiveSlideId)?.order
  )
  const competitionId = useAppSelector((state) => state.competitionLogin.data?.competition_id)
  const handleSelectSlide = (index: number) => {
    setCurrentSlide(slides[index])
  }
  useEffect(() => {
    if (code && code !== '') {
      socketConnect('Judge')
    }
  }, [])
  useEffect(() => {
    if (!currentSlide) setCurrentSlide(slides?.[0])
  }, [slides])
  useEffect(() => {
    if (competitionId) {
      dispatch(getPresentationCompetition(competitionId.toString()))
    }
  }, [operatorActiveSlideId])
  // useEffect(() => {
  //   // Every second tic of the timer, load new answers
  //   // TODO: use a set interval that updates every second ( look in Timer.tsx in clien/src/pages/views/components )
  //   // Then clear interval when timer - Date.now() is negative
  //   if (timer !== null && timer - (Date.now() % 2) === 0 && competitionId) {
  //     dispatch(getPresentationCompetition(competitionId.toString()))
  //   }
  // }, [timer])
  return (
    <div style={{ height: '100%' }}>
      <JudgeAppBar position="fixed">
        <JudgeToolbar>
          <JudgeQuestionsLabel variant="h5">Frågor</JudgeQuestionsLabel>
          {operatorActiveSlideOrder !== undefined && (
            <Typography variant="h5">Operatör är på sida: {operatorActiveSlideOrder + 1}</Typography>
          )}
          <JudgeAnswersLabel variant="h5">Svar</JudgeAnswersLabel>
        </JudgeToolbar>
      </JudgeAppBar>
      <LeftDrawer
        width={leftDrawerWidth}
        variant="permanent"
        classes={{
          paper: classes.leftDrawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <List>
          {slides.map((slide, index) => (
            <SlideListItem
              selected={slide.order === currentSlide?.order}
              onClick={() => handleSelectSlide(index)}
              divider
              button
              key={slide.id}
              style={{ border: 2, borderStyle: slide.id === operatorActiveSlideId ? 'dashed' : 'none' }}
            >
              {renderSlideIcon(slide)}
              <ListItemText primary={`Sida ${slide.order + 1}`} />
            </SlideListItem>
          ))}
        </List>
      </LeftDrawer>
      <RightDrawer
        width={rightDrawerWidth}
        variant="permanent"
        classes={{
          paper: classes.rightDrawerPaper,
        }}
        anchor="right"
      >
        <div className={classes.toolbar} />
        {currentQuestion && (
          <ScoreHeaderPaper $rightDrawerWidth={rightDrawerWidth} elevation={4}>
            <Typography variant="h4">{`${currentQuestion.name} (${currentQuestion.total_score}p)`}</Typography>
          </ScoreHeaderPaper>
        )}
        <ScoreHeaderPadding />
        <List style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
          {teams &&
            teams.map((answer, index) => (
              <div key={answer.name}>
                {currentSlide && <JudgeScoreDisplay teamIndex={index} activeSlide={currentSlide} />}
                <Divider />
              </div>
            ))}
        </List>
        <ScoreFooterPadding />
        {currentQuestion && <JudgeScoringInstructions question={currentQuestion} />}
      </RightDrawer>
      <div className={classes.toolbar} />
      <Content leftDrawerWidth={leftDrawerWidth} rightDrawerWidth={rightDrawerWidth}>
        <InnerContent>
          {activeViewTypeId && currentSlide && (
            <SlideDisplay variant="presentation" currentSlideId={currentSlide.id} activeViewTypeId={activeViewTypeId} />
          )}
        </InnerContent>
      </Content>
      <Snackbar open={successMessageOpen} autoHideDuration={4000} onClose={() => setSuccessMessageOpen(false)}>
        <Alert severity="success">{`Du har gått med i tävlingen "${competitionName}" som domare`}</Alert>
      </Snackbar>
    </div>
  )
}

export default JudgeViewPage
