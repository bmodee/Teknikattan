import { List, ListItem, Popover, Tooltip, Typography } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BackspaceIcon from '@material-ui/icons/Backspace'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import TimerIcon from '@material-ui/icons/Timer'
import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getPresentationCompetition, getPresentationTeams, setPresentationCode } from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewParams } from '../../interfaces/ViewParams'
import {
  socketEndPresentation,
  socketSetSlide,
  socketSetSlideNext,
  socketSetSlidePrev,
  socketStartPresentation,
  socketStartTimer,
  socket_connect,
} from '../../sockets'
import SlideDisplay from './components/SlideDisplay'
import Timer from './components/Timer'
import {
  PresenterButton,
  PresenterContainer,
  PresenterFooter,
  PresenterHeader,
  SlideCounter,
  ToolBarContainer,
} from './styled'

const PresenterViewPage: React.FC = () => {
  const teams = useAppSelector((state) => state.presentation.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const { id, code }: ViewParams = useParams()
  const presentation = useAppSelector((state) => state.presentation)
  const history = useHistory()
  const dispatch = useAppDispatch()

  useEffect(() => {
    socket_connect()
    socketSetSlide
    dispatch(getPresentationCompetition(id))
    dispatch(getPresentationTeams(id))
    dispatch(setPresentationCode(code))
  }, [])

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const startCompetition = () => {
    socketStartPresentation()
    const haveStarted = true
    console.log('You have started the competition! GLHF!')
    console.log(haveStarted)
  }

  const endCompetition = () => {
    if (confirm('Är du säker på att du vill avsluta tävlingen för alla?')) {
      const haveStarted = false
      socketEndPresentation()
      history.push('/admin')
      window.location.reload(false) // TODO: fix this ugly hack, we "need" to refresh site to be able to run the competition correctly again
    }
  }

  return (
    <PresenterContainer>
      <PresenterHeader>
        <Tooltip title="Avsluta tävling" arrow>
          <PresenterButton onClick={endCompetition} variant="contained" color="secondary">
            <BackspaceIcon fontSize="large" />
          </PresenterButton>
        </Tooltip>
        <SlideCounter>
          <Typography variant="h3">
            {presentation.slide.id} / {presentation.competition.slides.length}
          </Typography>
        </SlideCounter>
      </PresenterHeader>
      <SlideDisplay />
      <PresenterFooter>
        <ToolBarContainer>
          <Tooltip title="Previous Slide" arrow>
            <PresenterButton onClick={socketSetSlidePrev} variant="contained">
              <ChevronLeftIcon fontSize="large" />
            </PresenterButton>
          </Tooltip>

          <Tooltip title="Start Presentation" arrow>
            <PresenterButton onClick={startCompetition} variant="contained">
              <PlayArrowIcon fontSize="large" />
            </PresenterButton>
          </Tooltip>

          {/* 
          // This creates a join button, but presenter should not join others, others should join presenter
          <Tooltip title="Join Presentation" arrow>
            <PresenterButton onClick={socketJoinPresentation} variant="contained">
              <GroupAddIcon fontSize="large" />
            </PresenterButton>
          </Tooltip>
          

          // This creates another end button, it might not be needed since we already have one
          <Tooltip title="End Presentation" arrow>
            <PresenterButton onClick={socketEndPresentation} variant="contained">
              <CancelIcon fontSize="large" />
            </PresenterButton>
          </Tooltip>
          */}

          <Tooltip title="Start Timer" arrow>
            <PresenterButton onClick={socketStartTimer} variant="contained">
              <TimerIcon fontSize="large" />
              <Timer></Timer>
            </PresenterButton>
          </Tooltip>

          <Tooltip title="Scoreboard" arrow>
            <PresenterButton onClick={handleOpenPopover} variant="contained">
              <AssignmentIcon fontSize="large" />
            </PresenterButton>
          </Tooltip>

          <Tooltip title="Next Slide" arrow>
            <PresenterButton onClick={socketSetSlideNext} variant="contained">
              <ChevronRightIcon fontSize="large" />
            </PresenterButton>
          </Tooltip>
        </ToolBarContainer>
      </PresenterFooter>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          {/**  TODO:
           *    Fix scoreboard
           */}
          {teams.map((team) => (
            <ListItem key={team.id}>{team.name} score: 20</ListItem>
          ))}
        </List>
      </Popover>
    </PresenterContainer>
  )
}

export default PresenterViewPage
