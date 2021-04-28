import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import BackspaceIcon from '@material-ui/icons/Backspace'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TimerIcon from '@material-ui/icons/Timer'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getPresentationCompetition, setPresentationCode } from '../../actions/presentation'
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
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import PresentationComponent from './components/PresentationComponent'
import Timer from './components/Timer'
import {
  OperatorButton,
  OperatorContainer,
  OperatorFooter,
  OperatorHeader,
  OperatorContent,
  OperatorInnerContent,
  SlideCounter,
  ToolBarContainer,
} from './styled'

/**
 *  Description:
 *
 *  Presentation is an active competition
 *
 *
 *  ===========================================
 *  TODO:
 *  - Instead of copying code for others to join the competition, copy URL.
 *
 *  - Make code popup less code by using .map instead
 *
 *  - Fix scoreboard
 *
 *  - When two userers are connected to the same Localhost:5000 and updates/starts/end competition it
 *    creates a bug where the competition can't be started.
 * ===========================================
 */

const OperatorViewPage: React.FC = () => {
  // for dialog alert
  const [openAlert, setOpen] = React.useState(false)
  const [openAlertCode, setOpenCode] = React.useState(true)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const teams = useAppSelector((state) => state.presentation.competition.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const { id, code }: ViewParams = useParams()
  const presentation = useAppSelector((state) => state.presentation)
  const history = useHistory()
  const dispatch = useAppDispatch()
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Operator')?.id

  useEffect(() => {
    dispatch(getPresentationCompetition(id))
    dispatch(setPresentationCode(code))
    socket_connect()
    socketSetSlide // Behövs denna?
    setTimeout(startCompetition, 1000) // Ghetto, wait for everything to load
    // console.log(id)
  }, [])

  window.onpopstate = () => {
    //Handle browser back arrow
    alert('Tävlingen avslutas för alla')
    endCompetition()
  }

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
    setOpenCode(false)
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

  const handleOpenCodes = () => {
    setOpenCode(true)
  }

  const handleCopy = () => {
    console.log('copied code to clipboard')
  }

  const endCompetition = () => {
    setOpen(false)
    socketEndPresentation()
    history.push('/admin/tävlingshanterare')
    window.location.reload(false) // TODO: fix this ugly hack, we "need" to refresh site to be able to run the competition correctly again
  }

  return (
    <OperatorContainer>
      <Dialog
        fullScreen={fullScreen}
        open={openAlertCode}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{'Koder för tävlingen'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <ListItem>
              <ListItemText primary={`Domare: ${presentation.code}`} />
              <Tooltip title="Kopiera kod" arrow>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(presentation.code)
                  }}
                >
                  <FileCopyIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ListItem>
            <ListItem>
              <ListItemText primary={`Tävlande: ${presentation.code}`} />
              <Tooltip title="Kopiera kod" arrow>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(presentation.code)
                  }}
                >
                  <FileCopyIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ListItem>
            <ListItem>
              <ListItemText primary={`Publik: ${presentation.code}`} />
              <Tooltip title="Kopiera kod" arrow>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(presentation.code)
                  }}
                >
                  <FileCopyIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ListItem>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <OperatorHeader>
        <Tooltip title="Avsluta tävling" arrow>
          <OperatorButton onClick={handleVerifyExit} variant="contained" color="secondary">
            <BackspaceIcon fontSize="large" />
          </OperatorButton>
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
      </OperatorHeader>
      <div style={{ height: 0, paddingTop: 120 }} />
      <OperatorContent>
        <OperatorInnerContent>
          {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
        </OperatorInnerContent>
      </OperatorContent>
      <div style={{ height: 0, paddingTop: 140 }} />
      <OperatorFooter>
        <ToolBarContainer>
          <Tooltip title="Föregående" arrow>
            <OperatorButton onClick={socketSetSlidePrev} variant="contained">
              <ChevronLeftIcon fontSize="large" />
            </OperatorButton>
          </Tooltip>

          {/* 
          // Manual start button
          <Tooltip title="Start Presentation" arrow>
            <OperatorButton onClick={startCompetition} variant="contained">
              start
            </OperatorButton>
          </Tooltip>

          
          // This creates a join button, but Operator should not join others, others should join Operator
          <Tooltip title="Join Presentation" arrow>
            <OperatorButton onClick={socketJoinPresentation} variant="contained">
              <GroupAddIcon fontSize="large" />
            </OperatorButton>
          </Tooltip>
          

          // This creates another end button, it might not be needed since we already have one
          <Tooltip title="End Presentation" arrow>
            <OperatorButton onClick={socketEndPresentation} variant="contained">
              <CancelIcon fontSize="large" />
            </OperatorButton>
          </Tooltip>
          */}

          <Tooltip title="Starta Timer" arrow>
            <OperatorButton onClick={socketStartTimer} variant="contained">
              <TimerIcon fontSize="large" />
              <Timer></Timer>
            </OperatorButton>
          </Tooltip>

          <Tooltip title="Ställning" arrow>
            <OperatorButton onClick={handleOpenPopover} variant="contained">
              <AssignmentIcon fontSize="large" />
            </OperatorButton>
          </Tooltip>

          <Tooltip title="Koder" arrow>
            <OperatorButton onClick={handleOpenCodes} variant="contained">
              <SupervisorAccountIcon fontSize="large" />
            </OperatorButton>
          </Tooltip>

          <Tooltip title="Nästa" arrow>
            <OperatorButton onClick={socketSetSlideNext} variant="contained">
              <ChevronRightIcon fontSize="large" />
            </OperatorButton>
          </Tooltip>
        </ToolBarContainer>
      </OperatorFooter>
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
          {teams.map((team) => (
            <ListItem key={team.id}>
              {team.name} score: {team.question_answers}{' '}
            </ListItem>
          ))}
        </List>
      </Popover>
    </OperatorContainer>
  )
}

export default OperatorViewPage
