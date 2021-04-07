import { Button, Menu, TextField, Typography } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper'
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
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { RemoveCompetition, TopBar } from './styled'

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
  const citiesTotal = useAppSelector((state) => state.cities.total)
  const cities = useAppSelector((state) => state.cities.cities)
  const [newCity, setNewCity] = React.useState()
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const handleClose = () => {
    setAnchorEl(null)
    setActiveId(undefined)
  }

  useEffect(() => {
    dispatch(getCities())
  }, [])

  const handleDeleteCity = async () => {
    if (activeId) {
      await axios
        .delete(`/misc/cities/${activeId}`)
        .then(() => {
          setAnchorEl(null)
          dispatch(getCities())
        })
        .catch(({ response }) => {
          console.warn(response.data)
        })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget)
    setActiveId(id)
  }

  const handleAddCity = async () => {
    await axios
      .post(`/misc/cities`, { name: newCity })
      .then(() => {
        setAnchorEl(null)
        dispatch(getCities())
      })
      .catch(({ response }) => {
        console.warn(response.data)
      })
  }

  const handleChange = (event: any) => {
    setNewCity(event.target.value)
  }

  return (
    <div>
      <TopBar>
        <FormControl className={classes.margin}>
          <TextField className={classes.margin} value={newCity} onChange={handleChange} label="Region"></TextField>
          <Button color="primary" variant="contained" onClick={handleAddCity}>
            Lägg till
          </Button>
        </FormControl>
      </TopBar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Regioner</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities &&
              cities.map((row) => (
                <TableRow key={row.name}>
                  <TableCell scope="row">{row.name}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(event) => handleClick(event, row.id)}>
                      <MoreHorizIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {(!cities || cities.length === 0) && <Typography>Inga regioner hittades</Typography>}
      </TableContainer>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <RemoveCompetition onClick={handleDeleteCity}>Ta bort</RemoveCompetition>
      </Menu>
    </div>
  )
}

export default UserManager
