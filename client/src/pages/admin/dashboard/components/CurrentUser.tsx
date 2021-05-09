import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../../hooks'

/** This component show information about the currently logged in user */

const CurrentUser: React.FC = () => {
  const currentUser = useAppSelector((state: { user: { userInfo: any } }) => state.user.userInfo)
  const roles = useAppSelector((state) => state.roles.roles)
  const region = useAppSelector((state) => state.cities.cities)

  const handleRole = (id: number) => {
    return id
  }

  const handleRegion = (id: number) => {
    return id
  }

  return (
    <div>
      <Box display="flex" flexDirection="column" alignContent="flex-start">
        <div>
          <Typography variant="h2">
            Välkommen{currentUser && currentUser.name ? `, ${currentUser.name}` : ''}!
          </Typography>
        </div>
        <div>
          <Typography data-testid="userEmail" variant="h6">
            Email: {currentUser && currentUser.email}
          </Typography>
        </div>
        <div>
          <Typography variant="h6">Region: {handleRegion(currentUser.city_id)}</Typography>
        </div>
        <div>
          <Typography variant="h6">Roll: {handleRole(currentUser.role_id)}</Typography>
        </div>
      </Box>
    </div>
  )
}

export default CurrentUser
