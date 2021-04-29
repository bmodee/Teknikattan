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
  Theme,
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
import axios from 'axios'
import { Team } from '../../interfaces/ApiModels'

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
  const [teams, setTeams] = React.useState<Team[]>([])
  const [competitionName, setCompetitionName] = React.useState<string | undefined>(undefined)

  //const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const classes = useStyles()
  //const teams = useAppSelector((state) => state.presentation.competition.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const { id, code }: ViewParams = useParams()
  const presentation = useAppSelector((state) => state.presentation)
  const activeId = useAppSelector((state) => state.presentation.competition.id)
  const history = useHistory()
  const dispatch = useAppDispatch()
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Operator')?.id

  useEffect(() => {
    dispatch(getPresentationCompetition(id))
    dispatch(setPresentationCode(code))
    socket_connect()
    socketSetSlide // Behövs denna?
    handleOpenCodes()
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

  const handleOpenCodes = async () => {
    await getCodes()
    await getTeams()
    await getCompetitionName()
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

  const getCodes = async () => {
    await axios
      .get(`/api/competitions/${activeId}/codes`)
      .then((response) => {
        console.log(response.data)
        setCodes(response.data.items)
      })
      .catch(console.log)
  }

  const getTeams = async () => {
    await axios
      .get(`/api/competitions/${activeId}/teams`)
      .then((response) => {
        console.log(response.data.items)
        setTeams(response.data.items)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getCompetitionName = async () => {
    await axios
      .get(`/api/competitions/${activeId}`)
      .then((response) => {
        console.log(response.data.name)
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
        <DialogTitle id="max-width-dialog-title" className={classes.paper}>
          Koder för {competitionName}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Här visas tävlingskoderna till den valda tävlingen.</DialogContentText> */}
          {codes.map((code) => (
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
          {teams &&
            teams.map((team) => (
              <ListItem key={team.id}>
                {team.name} score: {'666'}
              </ListItem>
            ))}
        </List>
      </Popover>
    </OperatorContainer>
  )
}

export default OperatorViewPage