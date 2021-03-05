import Button from '@material-ui/core/Button'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import './ViewSelectPage.css'

const ViewSelectPage: React.FC = (props) => {
  const { path, url } = useRouteMatch()
  return (
    <div className="root">
      <div className="button-group">
        <Button className="view-button" color="primary" variant="contained" component={Link} to={`${url}/participant`}>
          Deltagarvy
        </Button>
        <Button className="view-button" color="primary" variant="contained" component={Link} to={`${url}/audience`}>
          Åskådarvy
        </Button>
        <Button className="view-button" color="primary" variant="contained" component={Link} to={`${url}/judge`}>
          Domarvy
        </Button>
      </div>
    </div>
  )
}

export default ViewSelectPage
