import { TablePagination, TextField, Typography } from '@material-ui/core'
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
import React, { useEffect } from 'react'
import { getSearchUsers, setFilterParams } from '../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { User } from '../../../interfaces/ApiModels'
import { UserFilterParams } from '../../../interfaces/FilterParams'
import { FilterContainer, TopBar } from '../styledComp'
import AddUser from './AddUser'
import EditUser from './EditUser'

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
  const [editAnchorEl, setEditAnchorEl] = React.useState<null | HTMLElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const [selectedUser, setSelectedUser] = React.useState<User | undefined>(undefined)
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const users = useAppSelector((state) => state.searchUsers.users)
  const filterParams = useAppSelector((state) => state.searchUsers.filterParams)
  const usersTotal = useAppSelector((state) => state.searchUsers.total)
  const cities = useAppSelector((state) => state.cities.cities)
  const roles = useAppSelector((state) => state.roles.roles)
  const classes = useStyles()
  const noFilterText = 'Alla'
  const dispatch = useAppDispatch()

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedUser(undefined)
    console.log('close')
  }

  const handleEditClose = () => {
    setEditAnchorEl(null)
    console.log('edit close')
  }

  useEffect(() => {
    dispatch(getSearchUsers())
  }, [])

  useEffect(() => {
    setEditAnchorEl(null)
    setAnchorEl(null)
  }, [users])

  const onSearchChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates filter and api 100ms after last input was made
    setTimerHandle(window.setTimeout(() => dispatch(getSearchUsers()), 100))
    dispatch(setFilterParams({ ...filterParams, email: event.target.value }))
  }

  const handleFilterChange = (newParams: UserFilterParams) => {
    dispatch(setFilterParams(newParams))
    dispatch(getSearchUsers())
  }

  const handleStateClick = () => {
    setEditAnchorEl(anchorEl)
    setAnchorEl(null)
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
                    <EditUser user={row}></EditUser>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {(!users || users.length === 0) && <Typography>Inga användare hittades med nuvarande filter</Typography>}
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        rowsPerPage={filterParams.pageSize}
        count={usersTotal}
        page={filterParams.page}
        onChangePage={(event, newPage) => handleFilterChange({ ...filterParams, page: newPage })}
      />
    </div>
  )
}

export default UserManager
