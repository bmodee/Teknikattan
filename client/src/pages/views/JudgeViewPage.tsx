import { Divider, List, ListItemText, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getPresentationCompetition,
  getPresentationTeams,
  setCurrentSlide,
  setPresentationCode,
} from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewParams } from '../../interfaces/ViewParams'
import { socket_connect } from '../../sockets'
import { SlideListItem } from '../presentationEditor/styled'
import JudgeScoreDisplay from './components/JudgeScoreDisplay'
import SlideDisplay from './components/SlideDisplay'
import {
  Content,
  JudgeAnswersLabel,
  JudgeAppBar,
  JudgeQuestionsLabel,
  JudgeToolbar,
  LeftDrawer,
  RightDrawer,
} from './styled'

const leftDrawerWidth = 150
const rightDrawerWidth = 390

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
  const { id, code }: ViewParams = useParams()
  const dispatch = useAppDispatch()
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
  const teams = useAppSelector((state) => state.presentation.teams)
  const slides = useAppSelector((state) => state.presentation.competition.slides)
  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(index)
    dispatch(setCurrentSlide(slides[index]))
  }

  useEffect(() => {
    socket_connect()
    dispatch(getPresentationCompetition(id))
    dispatch(getPresentationTeams(id))
    dispatch(setPresentationCode(code))
  }, [])

  return (
    <div>
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
              <Typography variant="h6">Slide ID: {slide.id} </Typography>
              <ListItemText primary={slide.title} />
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
        <List>
          {teams.map((answer, index) => (
            <div key={answer.name}>
              <JudgeScoreDisplay teamIndex={index} />
              <Divider />
            </div>
          ))}
        </List>
      </RightDrawer>
      <Content leftDrawerWidth={leftDrawerWidth} rightDrawerWidth={rightDrawerWidth}>
        <div className={classes.toolbar} />
        <SlideDisplay />
      </Content>
    </div>
  )
}

export default JudgeViewPage
