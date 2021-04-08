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
import { getCities } from '../../../actions/cities'
import { getRoles } from '../../../actions/roles'
import { getSearchUsers, setFilterParams } from '../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { UserFilterParams } from '../../../interfaces/UserData'
import AddUser from './AddUser'
import { FilterContainer, RemoveCompetition, TopBar } from './styled'

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

const UserManager: React.FC = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [activeId, setActiveId] = React.useState<number | undefined>(undefined)
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const users = useAppSelector((state) => state.searchUsers.users)
  const filterParams = useAppSelector((state) => state.searchUsers.filterParams)
  const usersTotal = useAppSelector((state) => state.searchUsers.total)
  const cities = useAppSelector((state) => state.cities.cities)
  const roles = useAppSelector((state) => state.roles.roles)
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
    dispatch(getRoles())
    dispatch(getSearchUsers())
  }, [])

  const onSearchChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates filter and api 100ms after last input was made
    setTimerHandle(window.setTimeout(() => dispatch(getSearchUsers()), 100))
    dispatch(setFilterParams({ ...filterParams, email: event.target.value }))
  }

  const handleDeleteUsers = async () => {
    if (activeId) {
      await axios
        .delete(`/auth/delete/${activeId}`)
        .then(() => {
          setAnchorEl(null)
          dispatch(getSearchUsers())
        })
        .catch(({ response }) => {
          console.warn(response.data)
        })
    }
  }

  const handleFilterChange = (newParams: UserFilterParams) => {
    dispatch(setFilterParams(newParams))
    dispatch(getSearchUsers())
  }

  return (
    <div>
      <TopBar>
        <FilterContainer>
          <TextField
            className={classes.margin}
            value={filterParams.email || ''}
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
          <FormControl className={classes.margin}>
            <InputLabel shrink id="demo-customized-select-native">
              Roles
            </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={filterParams.roleId ? roles.find((role) => filterParams.roleId === role.id)?.name : noFilterText}
            >
              <MenuItem value={noFilterText} onClick={() => handleFilterChange({ ...filterParams, roleId: undefined })}>
                {noFilterText}
              </MenuItem>
              {roles &&
                roles.map((role) => (
                  <MenuItem
                    key={role.name}
                    value={role.name}
                    onClick={() => handleFilterChange({ ...filterParams, roleId: role.id })}
                  >
                    {role.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </FilterContainer>
        <AddUser />
      </TopBar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Namn</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((row) => (
                <TableRow key={row.email}>
                  <TableCell scope="row">{row.email}</TableCell>
                  <TableCell scope="row">{row.name}</TableCell>
                  <TableCell>{cities.find((city) => city.id === row.city_id)?.name || ''}</TableCell>
                  <TableCell>{roles.find((role) => role.id === row.role_id)?.name || ''}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(event) => handleClick(event, row.id)}>
                      <MoreHorizIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {(!users || users.length === 0) && <Typography>Inga tävlingar hittades med nuvarande filter</Typography>}
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        rowsPerPage={filterParams.pageSize}
        count={usersTotal}
        page={filterParams.page}
        onChangePage={(event, newPage) => handleFilterChange({ ...filterParams, page: newPage })}
      />
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>Redigera</MenuItem>
        <MenuItem>Byt lösenord</MenuItem>
        <RemoveCompetition onClick={handleDeleteUsers}>Ta bort</RemoveCompetition>
      </Menu>
    </div>
  )
}

export default UserManager
