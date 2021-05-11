import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../../hooks'

/** This component show information about the currently logged in user */

const CurrentUser: React.FC = () => {
  const currentUser = useAppSelector((state: { user: { userInfo: any } }) => state.user.userInfo)
  const regions = useAppSelector((state) => state.cities.cities)
  //const regionlist = regions.map((index) => index.name)
  const regionlist = regions.map((index) => index)
  const roles = useAppSelector((state) => state.roles.roles)
  const rolelist = roles.map((index) => index)

  /** This is a temporary fix, these values "should" be stored in the state along with all the othe userinfo */
  const getRegionName = () => {
    if (currentUser && regions) {
      for (let i = 0; i < regionlist.length; i++) {
        if (regionlist[i].id === currentUser.city_id) {
          return regionlist[i].name
        }
      }
    }
    return 'N/A'
  }

  /** This is a temporary fix, these values "should" be stored in the state along with all the othe userinfo */
  const getRoleName = () => {
    if (currentUser && roles) {
      for (let i = 0; i < rolelist.length; i++) {
        if (rolelist[i].id === currentUser.role_id) {
          return rolelist[i].name
        }
      }
    }
    return 'N/A'
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
          <Typography variant="h6">Region: {getRegionName()}</Typography>
        </div>
        <div>
          <Typography variant="h6">Roll: {getRoleName()}</Typography>
        </div>
      </Box>
    </div>
  )
}

export default CurrentUser
