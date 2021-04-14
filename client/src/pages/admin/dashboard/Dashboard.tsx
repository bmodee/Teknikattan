import { createStyles, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import React from 'react'
import CurrentUser from './components/CurrentUser'
import NumberOfCompetitions from './components/NumberOfCompetitions'
import NumberOfRegions from './components/NumberOfRegions'
import NumberOfUsers from './components/NumberOfUsers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
)

const Dashboard: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <CurrentUser />
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper className={classes.paper}>
              <Typography variant="h4">Antal Användare:</Typography>
              <NumberOfUsers />
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>
              <Typography variant="h4">Antal Regioner:</Typography>
              <NumberOfRegions />
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>
              <Typography variant="h4">Antal Tävlingar:</Typography>
              <NumberOfCompetitions />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Dashboard
