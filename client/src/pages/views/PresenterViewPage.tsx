import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BackspaceIcon from '@material-ui/icons/Backspace'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
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

/**
 *  Presentation is an active competition
 */

const PresenterViewPage: React.FC = () => {
  // for dialog alert
  const [openAlert, setOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const teams = useAppSelector((state) => state.presentation.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const { id, code }: ViewParams = useParams()
  const presentation = useAppSelector((state) => state.presentation)
  const history = useHistory()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getPresentationCompetition(id))
    dispatch(getPresentationTeams(id))
    dispatch(setPresentationCode(code))
    socket_connect()
    socketSetSlide // Behövs denna?
    setTimeout(startCompetition, 500) // Ghetto, wait for everything to load
    // console.log(id)
  }, [])

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const startCompetition = () => {
    socketStartPresentation()
    console.log('started competition for')
    console.log(id)
  }

  const handleVerifyExit = () => {
    setOpen(true)
  }

  const endCompetition = () => {
    setOpen(false)
    socketEndPresentation()
    history.push('/admin/tävlingshanterare')
    window.location.reload(false) // TODO: fix this ugly hack, we "need" to refresh site to be able to run the competition correctly again
  }

  return (
    <PresenterContainer>
      <PresenterHeader>
        <Tooltip title="Avsluta tävling" arrow>
          <PresenterButton onClick={handleVerifyExit} variant="contained" color="secondary">
            <BackspaceIcon fontSize="large" />
          </PresenterButton>
        </Tooltip>

        <Dialog
          fullScreen={fullScreen}
          open={openAlert}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{'Vill du avsluta tävlingen?'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Genom att avsluta tävlingen kommer den avslutas för alla. Du kommer gå tillbaka till startsidan.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Avbryt
            </Button>
            <Button onClick={endCompetition} color="primary" autoFocus>
              Avsluta tävling
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h3">{presentation.competition.name}</Typography>
        <SlideCounter>
          <Typography variant="h3">
            {presentation.slide.order + 1} / {presentation.competition.slides.length}
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

          {/* 
          // Manual start button
          <Tooltip title="Start Presentation" arrow>
            <PresenterButton onClick={startCompetition} variant="contained">
              start
            </PresenterButton>
          </Tooltip>

          
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
function componentDidMount() {
  throw new Error('Function not implemented.')
}
