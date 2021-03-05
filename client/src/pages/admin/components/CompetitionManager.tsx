import { Button, Menu } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputBase from '@material-ui/core/InputBase'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import React from 'react'
import { Link } from 'react-router-dom'
import './CompetitionManager.css'

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  })
)(InputBase)

function createCompetition(name: string, region: string, year: number, id: number) {
  return { name, region, year, id }
}

const competitions = [
  createCompetition('Tävling 1', 'Stockholm', 2021, 1),
  createCompetition('Tävling 2', 'Stockholm', 2020, 2),
  createCompetition('Tävling 3', 'Sala', 2020, 3),
  createCompetition('Tävling 4', 'Sundsvall', 2020, 4),
  createCompetition('Tävling 5', 'Linköping', 2020, 5),
  createCompetition('Tävling 6', 'Linköping', 2020, 6),
  createCompetition('Tävling 7', 'Sala', 2019, 7),
  createCompetition('Tävling 8', 'Stockholm', 2019, 8),
  createCompetition('Tävling 9', 'Stockholm', 2019, 9),
  createCompetition('Tävling 10', 'Lidköping', 2019, 10),
  createCompetition('Tävling 11', 'Stockholm', 2019, 11),
  createCompetition('Tävling 12', 'Sala', 2018, 12),
  createCompetition('Tävling 13', 'Tornby', 2018, 13),
]

const regions = competitions
  .map((competition) => competition.region)
  .filter((competition, index, self) => self.indexOf(competition) === index)

const years = competitions
  .map((competition) => competition.year)
  .filter((competition, index, self) => self.indexOf(competition) === index)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      width: 1500, // TODO: Shrink table when smaller screen
    },
    margin: {
      margin: theme.spacing(1),
    },
  })
)

const CompetitionManager: React.FC = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const classes = useStyles()
  const yearInitialValue = 0
  const regionInitialValue = ''
  const noFilterText = 'Alla'
  const [searchInput, setSearchInput] = React.useState('')
  const [year, setYear] = React.useState(yearInitialValue)
  const [region, setRegion] = React.useState(regionInitialValue)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchInput(event.target.value)
  }

  return (
    <div>
      <div className="top-bar">
        <div>
          <FormControl className={classes.margin}>
            <InputLabel shrink id="demo-customized-textbox">
              Sök
            </InputLabel>
            <BootstrapInput id="demo-customized-textbox" onChange={onSearchChange} />
          </FormControl>
          <FormControl className={classes.margin}>
            <InputLabel shrink id="demo-customized-select-native">
              Region
            </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={region === regionInitialValue ? noFilterText : region}
              input={<BootstrapInput />}
            >
              <MenuItem value={noFilterText} onClick={() => setRegion(regionInitialValue)}>
                {noFilterText}
              </MenuItem>
              {regions.map((text, index) => (
                <MenuItem key={text} value={text} onClick={() => setRegion(text)}>
                  {text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.margin}>
            <InputLabel shrink id="demo-customized-select-label">
              År
            </InputLabel>
            <Select
              id="demo-customized-select"
              value={year === yearInitialValue ? noFilterText : year}
              input={<BootstrapInput />}
            >
              <MenuItem value={noFilterText} onClick={() => setYear(yearInitialValue)}>
                {noFilterText}
              </MenuItem>
              {years.map((year, index) => (
                <MenuItem key={year} value={year} onClick={() => setYear(year)}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button color="secondary" variant="contained" className="new-competition-button">
          Ny Tävling
        </Button>
      </div>
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
            {competitions
              .filter((row) => {
                const nameOkay = row.name.match(RegExp(searchInput, 'i')) //Makes sure name matches search input case insensitively
                const yearOkay = year == yearInitialValue || row.year == year
                const regionOkay = region == regionInitialValue || row.region == region
                return yearOkay && regionOkay && nameOkay
              })
              .map((row) => (
                <TableRow key={row.name}>
                  <TableCell scope="row">
                    <Button color="primary" component={Link} to={`/competition-id=${row.id}`}>
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell align="right">{row.region}</TableCell>
                  <TableCell align="right">{row.year}</TableCell>
                  <TableCell align="right">
                    <Button onClick={handleClick}>
                      <MoreHorizIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Starta</MenuItem>
        <MenuItem onClick={handleClose}>Duplicera</MenuItem>
        <MenuItem className="remove-competition" onClick={handleClose}>
          Ta bort
        </MenuItem>
      </Menu>
    </div>
  )
}

export default CompetitionManager
