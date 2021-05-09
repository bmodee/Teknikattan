import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Popover,
  Snackbar,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BackspaceIcon from '@material-ui/icons/Backspace'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import LinkIcon from '@material-ui/icons/Link'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import TimerIcon from '@material-ui/icons/Timer'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { RichTeam } from '../../interfaces/ApiRichModels'
import {
  socketConnect,
  socketEndPresentation,
  socketSetSlide,
  socketSetSlideNext,
  socketSetSlidePrev,
  socketStartPresentation,
  socketStartTimer,
} from '../../sockets'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'
import { Center } from '../presentationEditor/components/styled'
import Timer from './components/Timer'
import {
  OperatorButton,
  OperatorContainer,
  OperatorContent,
  OperatorFooter,
  OperatorHeader,
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
 *
 *  - Fix scoreboard
 *
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
  const [competitionName, setCompetitionName] = React.useState<string | undefined>(undefined)

  //const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const classes = useStyles()
  const teams = useAppSelector((state) => state.presentation.competition.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const competitionId = useAppSelector((state) => state.competitionLogin.data?.competition_id)
  const presentation = useAppSelector((state) => state.presentation)
  const activeId = useAppSelector((state) => state.presentation.competition.id)
  const history = useHistory()
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  const [successMessageOpen, setSuccessMessageOpen] = useState(true)
  const activeSlideOrder = useAppSelector(
    (state) =>
      state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)?.order
  )
  useEffect(() => {
    socketConnect('Operator')
    socketSetSlide
    handleOpenCodes()
    setTimeout(startCompetition, 1000) // Wait for socket to connect
  }, [])

  /** Handles the browsers back button and if pressed cancels the ongoing competition */
  window.onpopstate = () => {
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
    socketStartPresentation() // Calls the socket to start competition
    console.log('started competition for')
    console.log(competitionId)
  }

  /** Making sure the user wants to exit the competition by displaying a dialog box */
  const handleVerifyExit = () => {
    setOpen(true)
  }

  const handleOpenCodes = async () => {
    await getCodes()
    await getCompetitionName()
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

  const getCompetitionName = async () => {
    await axios
      .get(`/api/competitions/${activeId}`)
      .then((response) => {
        setCompetitionName(response.data.name)
      })
      .catch((err) => {
        console.log(err)
      })
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

  /** Sums the scores for the teams. */
  const addScore = (team: RichTeam) => {
    let totalScore = 0
    for (let j = 0; j < team.question_answers.length; j++) {
      totalScore = totalScore + team.question_answers[j].score
    }
    return totalScore
  }

  return (
    <OperatorContainer>
      <Dialog
        open={openAlertCode}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        maxWidth="xl"
        fullWidth={false}
        fullScreen={false}
      >
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

      <OperatorHeader>
        <Tooltip title="Avsluta tävling" arrow>
          <OperatorButton onClick={handleVerifyExit} variant="contained" color="secondary">
            <BackspaceIcon fontSize="large" />
          </OperatorButton>
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
        <Typography variant="h3">{presentation.competition.name}</Typography>
        <SlideCounter>
          <Typography variant="h3">
            {activeSlideOrder !== undefined && activeSlideOrder + 1} / {presentation.competition.slides.length}
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
          {teams &&
            teams.map((team) => (
              <ListItem key={team.id}>
                {team.name} score:{addScore(team)}
              </ListItem>
            ))}
        </List>
      </Popover>
      <Snackbar open={successMessageOpen} autoHideDuration={4000} onClose={() => setSuccessMessageOpen(false)}>
        <Alert severity="success">{`Du har gått med i tävlingen "${competitionName}" som operatör`}</Alert>
      </Snackbar>
    </OperatorContainer>
  )
}

export default OperatorViewPage
