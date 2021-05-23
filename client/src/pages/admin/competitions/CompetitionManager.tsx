import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemText,
  Menu,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import LinkIcon from '@material-ui/icons/Link'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import RefreshIcon from '@material-ui/icons/Refresh'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getCompetitions, setFilterParams } from '../../../actions/competitions'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { Team } from '../../../interfaces/ApiModels'
import { CompetitionFilterParams } from '../../../interfaces/FilterParams'
import { Center } from '../../presentationEditor/components/styled'
import { FilterContainer, RemoveMenuItem, TopBar, YearFilterTextField } from '../styledComp'
import AddCompetition from './AddCompetition'

/**
 * Component description:
 * This component shows a list of all the competitions which a user can search through
 * We can also start, duplicate or delete a competition
 */

// Use defined styling
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

const CompetitionManager: React.FC = (props: any) => {
  // for dialog alert
  const [openAlert, setOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [activeId, setActiveId] = React.useState<number | undefined>(undefined)
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [codes, setCodes] = React.useState<Code[]>([])
  const [teams, setTeams] = React.useState<Team[]>([])
  const [competitionName, setCompetitionName] = React.useState<string | undefined>(undefined)
  const loading = useAppSelector((state) => state.user.userInfo === null)
  const competitions = useAppSelector((state) => state.competitions.competitions)
  const filterParams = useAppSelector((state) => state.competitions.filterParams)
  const competitionTotal = useAppSelector((state) => state.competitions.total)
  const cities = useAppSelector((state) => state.cities.cities)
  const classes = useStyles()
  const noFilterText = 'Alla'
  const dispatch = useAppDispatch()
  const history = useHistory()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setActiveId(id)
    getCodes(id)
    getTeams(id)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setActiveId(undefined)
  }

  const handleCloseVerify = () => {
    setOpen(false)
  }

  useEffect(() => {
    dispatch(getCompetitions())
  }, [])

  // Searchfuntion to search for a specific string
  const onSearchChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates filter and api 100ms after last input was made
    setTimerHandle(window.setTimeout(() => dispatch(getCompetitions()), 100))
    dispatch(setFilterParams({ ...filterParams, name: event.target.value }))
  }

  const handleVerifyDelete = () => {
    setOpen(true)
  }

  // Function to remove a competition from the systems database
  const handleDeleteCompetition = async () => {
    setOpen(false)
    if (activeId) {
      await axios
        .delete(`/api/competitions/${activeId}`)
        .then(() => {
          setAnchorEl(null)
          dispatch(getCompetitions()) // refresh the competition list
        })
        .catch(({ response }) => {
          console.warn(response.data)
        })
    }
  }

  /** Start the competition by redirecting with URL with Code */
  const handleStartCompetition = () => {
    const operatorCode = codes.find((code) => code.view_type_id === 4)?.code
    if (operatorCode) {
      history.push(`/${operatorCode}`)
    }
  }

  /** Fetch all the connection codes from the server */
  const getCodes = async (id: number) => {
    await axios
      .get(`/api/competitions/${id}/codes`)
      .then((response) => {
        setCodes(response.data)
      })
      .catch(console.log)
  }

  /** Fetch all the teams from the server that is connected to a specific competition*/
  const getTeams = async (id: number) => {
    await axios
      .get(`/api/competitions/${id}/teams`)
      .then((response) => {
        setTeams(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /** Fetch the copetition name from the server */
  const getCompetitionName = async () => {
    await axios
      .get(`/api/competitions/${activeId}`)
      .then((response) => {
        // console.log(response.data.name)
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

  /** Handles the opening of the code dialog box */
  const handleOpenDialog = async () => {
    await getCompetitionName()
    setDialogIsOpen(true)
  }
  /** Handles the closing of the code dialog box */
  const handleCloseDialog = () => {
    setDialogIsOpen(false)
    setAnchorEl(null)
  }

  /** Function that copies an existing competition */
  const handleDuplicateCompetition = async () => {
    if (activeId) {
      await axios
        .post(`/api/competitions/${activeId}/copy`)
        .then(() => {
          setAnchorEl(null)
          dispatch(getCompetitions())
        })
        .catch(({ response }) => {
          console.warn(response.data)
        })
    }
  }

  const handleFilterChange = (newParams: CompetitionFilterParams) => {
    dispatch(setFilterParams(newParams))
    dispatch(getCompetitions())
  }

  const refreshCode = async (code: Code) => {
    if (activeId) {
      await axios
        .put(`/api/competitions/${activeId}/codes/${code.id}`)
        .then(() => {
          getCodes(activeId)
          dispatch(getCompetitions())
        })
        .catch(({ response }) => {
          console.warn(response.data)
        })
    }
  }

  return (
    <div>
      <TopBar>
        <FilterContainer>
          <TextField className={classes.margin} value={filterParams.name || ''} onChange={onSearchChange} label="Sök" />
          <FormControl className={classes.margin}>
            <InputLabel shrink id="demo-customized-select-native">
              Region
            </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={filterParams.cityId ? cities.find((city) => filterParams.cityId === city.id)?.name : noFilterText}
            >
              <MenuItem value={noFilterText} onClick={() => handleFilterChange({ ...filterParams, cityId: undefined })}>
                {noFilterText}
              </MenuItem>
              {cities &&
                cities.map((city) => (
                  <MenuItem
                    key={city.name}
                    value={city.name}
                    onClick={() => handleFilterChange({ ...filterParams, cityId: city.id })}
                  >
                    {city.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <YearFilterTextField
            label="År"
            name="model.year"
            type="number"
            value={filterParams.year || ''}
            onChange={(event) => handleFilterChange({ ...filterParams, year: +event.target.value })}
            margin="normal"
          />
        </FilterContainer>
        {!loading && <AddCompetition />}
      </TopBar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Namn</TableCell>
              <TableCell align="right">Region</TableCell>
              <TableCell align="right">År</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitions &&
              competitions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell scope="row">
                    <Button color="primary" component={Link} to={`/editor/competition-id=${row.id}`}>
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell align="right">{cities.find((city) => city.id === row.city_id)?.name || ''}</TableCell>
                  <TableCell align="right">{row.year}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(event) => handleClick(event, row.id)} data-testid={row.name}>
                      <MoreHorizIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/** We can't find any competitions at all or with a specific filter */}
        {(!competitions || competitions.length === 0) && (
          <Typography>Inga tävlingar hittades med nuvarande filter</Typography>
        )}
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        rowsPerPage={filterParams.pageSize}
        count={competitionTotal}
        page={filterParams.page - 1}
        onChangePage={(event, newPage) => handleFilterChange({ ...filterParams, page: newPage + 1 })}
      />
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleStartCompetition}>Starta</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Visa koder</MenuItem>
        <MenuItem onClick={handleDuplicateCompetition}>Duplicera</MenuItem>
        <RemoveMenuItem onClick={handleVerifyDelete} data-testid="removeCompetitionButton">
          Ta bort
        </RemoveMenuItem>
      </Menu>
      <Dialog
        fullScreen={fullScreen}
        open={openAlert}
        onClose={handleCloseVerify}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{'Ta bort tävlingen?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Är du säker på att du vill ta bort tävlingen och all dess information från systemet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseVerify} color="primary">
            Avbryt
          </Button>
          <Button data-testid="acceptRemoveCompetition" onClick={handleDeleteCompetition} color="primary" autoFocus>
            Ta bort
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogIsOpen}
        onClose={handleCloseDialog}
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
              <Tooltip title="Generera ny kod" arrow>
                <Button
                  margin-right="0px"
                  onClick={() => {
                    refreshCode(code)
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </Button>
              </Tooltip>
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
          <Button onClick={handleCloseDialog} color="primary">
            Stäng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CompetitionManager
