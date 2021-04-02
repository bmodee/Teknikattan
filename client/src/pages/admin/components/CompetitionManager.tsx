import { Button, Menu, TablePagination, TextField, Typography } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCities } from '../../../actions/cities'
import { getCompetitions, setFilterParams } from '../../../actions/competitions'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { CompetitionFilterParams } from '../../../interfaces/CompetitionFilterParams'
import AddCompetition from './AddCompetition'
import { FilterContainer, RemoveCompetition, TopBar, YearFilterTextField } from './styled'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      width: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
  })
)

const CompetitionManager: React.FC = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [activeId, setActiveId] = React.useState<number | undefined>(undefined)
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const competitions = useAppSelector((state) => state.competitions.competitions)
  const filterParams = useAppSelector((state) => state.competitions.filterParams)
  const competitionTotal = useAppSelector((state) => state.competitions.total)
  const cities = useAppSelector((state) => state.cities)
  const classes = useStyles()
  const noFilterText = 'Alla'
  const dispatch = useAppDispatch()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget)
    setActiveId(id)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setActiveId(undefined)
  }

  useEffect(() => {
    dispatch(getCities())
    dispatch(getCompetitions())
  }, [])

  const onSearchChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates filter and api 100ms after last input was made
    setTimerHandle(window.setTimeout(() => dispatch(getCompetitions()), 100))
    dispatch(setFilterParams({ ...filterParams, name: event.target.value }))
  }

  const handleDeleteCompetition = async () => {
    if (activeId) {
      await axios
        .delete(`/competitions/${activeId}`)
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

  return (
    <div>
      <TopBar>
        <FilterContainer>
          <TextField
            className={classes.margin}
            value={filterParams.name || ''}
            onChange={onSearchChange}
            label="Sök"
          ></TextField>
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
            value={filterParams.year || new Date().getFullYear()}
            onChange={(event) => handleFilterChange({ ...filterParams, year: +event.target.value })}
            margin="normal"
          />
        </FilterContainer>
        <AddCompetition />
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
                <TableRow key={row.name}>
                  <TableCell scope="row">
                    <Button color="primary" component={Link} to={`/editor/competition-id=${row.id}`}>
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell align="right">{cities.find((city) => city.id === row.city_id)?.name || ''}</TableCell>
                  <TableCell align="right">{row.year}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(event) => handleClick(event, row.id)}>
                      <MoreHorizIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {(!competitions || competitions.length === 0) && (
          <Typography>Inga tävlingar hittades med nuvarande filter</Typography>
        )}
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        rowsPerPage={filterParams.pageSize}
        count={competitionTotal}
        page={filterParams.page}
        onChangePage={(event, newPage) => handleFilterChange({ ...filterParams, page: newPage })}
      />
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Starta</MenuItem>
        <MenuItem onClick={handleClose}>Duplicera</MenuItem>
        <RemoveCompetition onClick={handleDeleteCompetition}>Ta bort</RemoveCompetition>
      </Menu>
    </div>
  )
}

export default CompetitionManager
