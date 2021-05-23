import { Button, Menu, Snackbar, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useEffect } from 'react'
import { getCities } from '../../../actions/cities'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { RemoveMenuItem, TopBar } from '../styledComp'
import AddRegion from './AddRegion'

/** shows all the regions in a list */

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

const RegionManager: React.FC = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [activeId, setActiveId] = React.useState<number | undefined>(undefined)
  const [errorActive, setErrorActive] = React.useState(false)
  const cities = useAppSelector((state) => state.cities.cities)
  const [newCity, setNewCity] = React.useState<string>()
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
        .delete(`/api/misc/cities/${activeId}`)
        .then(() => {
          setAnchorEl(null)
          dispatch(getCities())
        })
        .catch((response) => {
          if (response?.response?.status === 409) setErrorActive(true)
        })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget)
    setActiveId(id)
  }

  return (
    <div>
      <TopBar>
        <AddRegion />
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
                <TableRow key={row.id}>
                  <TableCell scope="row">{row.name}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(event) => handleClick(event, row.id)} data-testid={row.name}>
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
        <RemoveMenuItem onClick={handleDeleteCity} data-testid="removeRegionButton">
          Ta bort
        </RemoveMenuItem>
      </Menu>
      <Snackbar open={errorActive} autoHideDuration={4000} onClose={() => setErrorActive(false)}>
        <Alert severity="error">{`Du kan inte ta bort regionen eftersom det finns användare eller tävlingar kopplade till den.`}</Alert>
      </Snackbar>
    </div>
  )
}

export default RegionManager
