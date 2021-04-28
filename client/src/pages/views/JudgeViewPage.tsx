import { Card, Divider, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { getPresentationCompetition, setCurrentSlide, setPresentationCode } from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewParams } from '../../interfaces/ViewParams'
import { socket_connect } from '../../sockets'
import { SlideListItem } from '../presentationEditor/styled'
import JudgeScoreDisplay from './components/JudgeScoreDisplay'
import PresentationComponent from './components/PresentationComponent'
import { useHistory } from 'react-router-dom'
import {
  Content,
  InnerContent,
  JudgeAnswersLabel,
  JudgeAppBar,
  JudgeQuestionsLabel,
  JudgeToolbar,
  LeftDrawer,
  RightDrawer,
  ScoreHeaderPadding,
  ScoreHeaderPaper,
  ScoreFooterPadding,
} from './styled'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import JudgeScoringInstructions from './components/JudgeScoringInstructions'
import { renderSlideIcon } from '../../utils/renderSlideIcon'

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
type JudgeViewPageProps = {
  //Prop to distinguish between editor and active competition
  competitionId: number
  code: string
}

const JudgeViewPage = ({ competitionId, code }: JudgeViewPageProps) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Judge')?.id
  const teams = useAppSelector((state) => state.presentation.competition.teams)
  const slides = useAppSelector((state) => state.presentation.competition.slides)
  const currentQuestion = slides[activeSlideIndex]?.questions[0]
  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(index)
    dispatch(setCurrentSlide(slides[index]))
  }
  useEffect(() => {
    socket_connect()
    dispatch(getPresentationCompetition(competitionId.toString()))
    dispatch(setPresentationCode(code))
    //hides the url so people can't sneak peak
    history.push('judge')
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <JudgeAppBar position="fixed">
        <JudgeToolbar>
          <JudgeQuestionsLabel variant="h5">Frågor</JudgeQuestionsLabel>
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
              selected={index === activeSlideIndex}
              onClick={() => handleSelectSlide(index)}
              divider
              button
              key={slide.id}
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
                <JudgeScoreDisplay teamIndex={index} />
                <Divider />
              </div>
            ))}
        </List>
        <ScoreFooterPadding />
        <JudgeScoringInstructions question={currentQuestion} />
      </RightDrawer>
      <div className={classes.toolbar} />
      <Content leftDrawerWidth={leftDrawerWidth} rightDrawerWidth={rightDrawerWidth}>
        <InnerContent>
          {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
        </InnerContent>
      </Content>
    </div>
  )
}

export default JudgeViewPage
