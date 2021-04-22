import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../../hooks'

const CurrentUser: React.FC = () => {
  const currentUser = useAppSelector((state: { user: { userInfo: any } }) => state.user.userInfo)
  return (
    <div>
      <Box display="flex" flexDirection="column" alignContent="flex-start">
        <div>
          <Typography variant="h2">
            Välkommen{currentUser && currentUser.name ? `, ${currentUser.name}` : ''}!
          </Typography>
        </div>
        <div>
          <Typography variant="h6">Email: {currentUser && currentUser.email}</Typography>
        </div>
        <div>
          <Typography variant="h6">Region: {currentUser && currentUser.city && currentUser.city.name}</Typography>
        </div>
        <div>
          <Typography variant="h6">Roll: {currentUser && currentUser.role && currentUser.role.name}</Typography>
        </div>
      </Box>
    </div>
  )
}

export default CurrentUser