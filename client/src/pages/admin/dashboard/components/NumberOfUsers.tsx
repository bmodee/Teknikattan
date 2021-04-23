import { Box, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { getSearchUsers } from '../../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../../hooks'

const NumberOfUsers: React.FC = () => {
  const usersTotal = useAppSelector((state) => state.statistics.users)
  const dispatch = useAppDispatch()

  const handleCount = () => {
    if (usersTotal >= 1000000) {
      ;<div>{usersTotal / 1000000 + 'M'}</div>
    } else if (usersTotal >= 1000) {
      ;<div>{usersTotal / 1000 + 'K'}</div>
    }
    return <div>{usersTotal}</div>
  }

  useEffect(() => {
    dispatch(getSearchUsers())
  }, [])
  return (
    <div>
      <Box width="100%" height="100%">
        <div>
          <Typography variant="h4">{handleCount()}</Typography>
        </div>
      </Box>
    </div>
  )
}

export default NumberOfUsers
