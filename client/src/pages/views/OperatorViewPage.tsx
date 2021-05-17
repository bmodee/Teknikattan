import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemText,
  makeStyles,
  Snackbar,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CloseIcon from '@material-ui/icons/Close'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import LinkIcon from '@material-ui/icons/Link'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import TimerIcon from '@material-ui/icons/Timer'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { socketConnect, socketEndPresentation, socketSync } from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { Center } from '../presentationEditor/components/styled'
import Scoreboard from './components/Scoreboard'
import Timer from './components/Timer'
import {
  OperatorButton,
  OperatorContainer,
  OperatorContent,
  OperatorFooter,
  OperatorHeader,
  OperatorHeaderItem,
  OperatorInnerContent,
  OperatorQuitButton,
} from './styled'

/**
 *  Description:
 *
 *  Presentation is an active competition
 *
 *
 *  ===========================================
 *  TODO:
 *  - When two userers are connected to the same Localhost:5000 and updates/starts/end competition it
 *    creates a bug where the competition can't be started.
 * ===========================================
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      width: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: 4,
      outline: 'none',
    },
  })
)

interface Code {
  id: number
  code: string
  view_type_id: number
  competition_id: number
  team_id: number
}

const OperatorViewPage: React.FC = () => {
  // for dialog alert
  const [openAlert, setOpen] = React.useState(false)
  const [openAlertCode, setOpenCode] = React.useState(false)
  const [codes, setCodes] = React.useState<Code[]>([])
  const competitionName = useAppSelector((state) => state.presentation.competition.name)

  //const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const classes = useStyles()
  const teams = useAppSelector((state) => state.presentation.competition.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const presentation = useAppSelector((state) => state.presentation)
  const activeId = useAppSelector((state) => state.presentation.competition.id)
  const timer = useAppSelector((state) => state.presentation.timer)
  const history = useHistory()
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  const [successMessageOpen, setSuccessMessageOpen] = useState(true)
  const activeSlideOrder = useAppSelector(
    (state) =>
      state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)?.order
  )
  const slideTimer = useAppSelector((state) =>
    activeSlideOrder !== undefined ? state.presentation.competition.slides[activeSlideOrder].timer : null
  )
  const isFirstSlide = activeSlideOrder === 0
  const isLastSlide = useAppSelector((state) => activeSlideOrder === state.presentation.competition.slides.length - 1)
  const showScoreboard = useAppSelector((state) => state.presentation.show_scoreboard)

  useEffect(() => {
    socketConnect('Operator')
  }, [])

  /** Handles the browsers back button and if pressed cancels the ongoing competition */
  window.onpopstate = () => {
    alert('Tävlingen avslutas för alla')
    endCompetition()
  }

  const handleClose = () => {
    setOpen(false)
    setOpenCode(false)
    setAnchorEl(null)
  }

  /** Making sure the user wants to exit the competition by displaying a dialog box */
  const handleVerifyExit = () => {
    setOpen(true)
  }

  const handleOpenCodes = async () => {
    await getCodes()
    setOpenCode(true)
  }

  const endCompetition = () => {
    setOpen(false)
    socketEndPresentation()
    history.push('/admin/competition-manager')
    window.location.reload(false) // TODO: fix this, we "need" to refresh site to be able to run the competition correctly again
  }

  const getCodes = async () => {
    await axios
      .get(`/api/competitions/${activeId}/codes`)
      .then((response) => {
        setCodes(response.data.items)
      })
      .catch(console.log)
  }
  const getTypeName = (code: Code) => {
    let typeName = ''
    switch (code.view_type_id) {
      case 1:
        const team = teams.find((team) => team.id === code.team_id)
        if (team) {
          typeName = team.name
        } else {
          typeName = 'Lagnamn hittades ej'
        }
        break
      case 2:
        typeName = 'Domare'
        break
      case 3:
        typeName = 'Publik'
        break
      case 4:
        typeName = 'Tävlingsoperatör'
        break
      default:
        typeName = 'Typ hittades ej'
        break
    }
    return typeName
  }

  const handleStartTimer = () => {
    if (!slideTimer) return

    if (!timer.enabled) socketSync({ timer: { value: Date.now() + 1000 * slideTimer, enabled: true } })
    else socketSync({ timer: { ...timer, enabled: false } })
  }

  const handleSetNextSlide = () => {
    if (activeSlideOrder !== undefined)
      socketSync({ slide_order: activeSlideOrder + 1, timer: { value: null, enabled: false } })
  }

  const handleSetPrevSlide = () => {
    if (activeSlideOrder !== undefined)
      socketSync({ slide_order: activeSlideOrder - 1, timer: { value: null, enabled: false } })
  }

  return (
    <OperatorContainer>
      <Dialog open={openAlertCode} onClose={handleClose} aria-labelledby="max-width-dialog-title" maxWidth="xl">
        <Center>
          <DialogTitle id="max-width-dialog-title" className={classes.paper} style={{ width: '100%' }}>
            Koder för {competitionName}
          </DialogTitle>
        </Center>
        <DialogContent>
          {/* <DialogContentText>Här visas tävlingskoderna till den valda tävlingen.</DialogContentText> */}
          {codes &&
            codes.map((code) => (
              <ListItem key={code.id} style={{ display: 'flex' }}>
                <ListItemText primary={`${getTypeName(code)}: `} />
                <Typography component="div">
                  <ListItemText style={{ textAlign: 'right', marginLeft: '10px' }}>
                    <Box fontFamily="Monospace" fontWeight="fontWeightBold">
                      {code.code}
                    </Box>
                  </ListItemText>
                </Typography>
                <Tooltip title="Kopiera kod" arrow>
                  <Button
                    margin-right="0px"
                    onClick={() => {
                      navigator.clipboard.writeText(code.code)
                    }}
                  >
                    <FileCopyIcon fontSize="small" />
                  </Button>
                </Tooltip>
                <Tooltip title="Kopiera länk" arrow>
                  <Button
                    margin-right="0px"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.host}/${code.code}`)
                    }}
                  >
                    <LinkIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </ListItem>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Stäng
          </Button>
        </DialogActions>
      </Dialog>
      <OperatorHeader color="primary" position="fixed">
        <Tooltip title="Avsluta tävling" arrow>
          <OperatorQuitButton onClick={handleVerifyExit} variant="contained" color="secondary">
            <CloseIcon fontSize="large" />
          </OperatorQuitButton>
        </Tooltip>

        <Dialog open={openAlert} onClose={handleClose} aria-labelledby="responsive-dialog-title">
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
        <OperatorHeaderItem>
          <Typography variant="h4">{presentation.competition.name}</Typography>
        </OperatorHeaderItem>
        <OperatorHeaderItem>
          <Typography variant="h4">
            {activeSlideOrder !== undefined && activeSlideOrder + 1} / {presentation.competition.slides.length}
          </Typography>
        </OperatorHeaderItem>
      </OperatorHeader>
      {<div style={{ minHeight: 64 }} />}
      <OperatorContent>
        <OperatorInnerContent>
          {activeViewTypeId && <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />}
        </OperatorInnerContent>
      </OperatorContent>
      {<div style={{ minHeight: 128 }} />}
      <OperatorFooter position="fixed">
        <Tooltip title="Föregående sida" arrow>
          <OperatorButton onClick={handleSetPrevSlide} variant="contained" disabled={isFirstSlide} color="primary">
            <ChevronLeftIcon fontSize="large" />
          </OperatorButton>
        </Tooltip>

        {slideTimer !== null && (
          <Tooltip title="Starta timer" arrow>
            <OperatorButton
              onClick={handleStartTimer}
              variant="contained"
              disabled={timer.value !== null && !timer.enabled}
              color="primary"
            >
              <TimerIcon fontSize="large" />
              <Timer disableText />
            </OperatorButton>
          </Tooltip>
        )}

        <Tooltip title="Visa ställning för publik" arrow>
          <OperatorButton onClick={() => socketSync({ show_scoreboard: true })} variant="contained" color="primary">
            <AssignmentIcon fontSize="large" />
          </OperatorButton>
        </Tooltip>
        {showScoreboard && <Scoreboard isOperator />}

        <Tooltip title="Visa koder" arrow>
          <OperatorButton onClick={handleOpenCodes} variant="contained" color="primary">
            <SupervisorAccountIcon fontSize="large" />
          </OperatorButton>
        </Tooltip>

        <Tooltip title="Nästa sida" arrow>
          <OperatorButton onClick={handleSetNextSlide} variant="contained" disabled={isLastSlide} color="primary">
            <ChevronRightIcon fontSize="large" />
          </OperatorButton>
        </Tooltip>
      </OperatorFooter>

      <Snackbar
        open={successMessageOpen && Boolean(competitionName)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessageOpen(false)}
      >
        <Alert severity="success">{`Du har gått med i tävlingen "${competitionName}" som operatör`}</Alert>
      </Snackbar>
    </OperatorContainer>
  )
}

export default OperatorViewPage
