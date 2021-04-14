import { Box, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { getSearchUsers } from '../../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../../hooks'

const NumberOfCompetitions: React.FC = () => {
  const cities = useAppSelector((state) => state.cities.cities)
  const dispatch = useAppDispatch()

  const handleCount = () => {
    if (cities.length >= 1000000) {
      ;<div>{cities.length / 1000000 + 'M'}</div>
    } else if (cities.length >= 1000) {
      ;<div>{cities.length / 1000 + 'K'}</div>
    }
    return <div>{cities.length}</div>
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

export default NumberOfCompetitions
