import Button from '@material-ui/core/Button'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { ViewSelectButtonGroup, ViewSelectContainer } from './styled'

const ViewSelectPage: React.FC = () => {
  const url = useRouteMatch().url
  return (
    <ViewSelectContainer>
      <ViewSelectButtonGroup>
        <Button color="primary" variant="contained" component={Link} to={`${url}/participant`}>
          Deltagarvy
        </Button>
        <Button color="primary" variant="contained" component={Link} to={`${url}/audience`}>
          Åskådarvy
        </Button>
        <Button color="primary" variant="contained" component={Link} to={`${url}/judge`}>
          Domarvy
        </Button>
      </ViewSelectButtonGroup>
    </ViewSelectContainer>
  )
}

export default ViewSelectPage
