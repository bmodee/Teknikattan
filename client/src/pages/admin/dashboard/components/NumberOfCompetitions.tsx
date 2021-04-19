import { Box, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { getCompetitions } from '../../../../actions/competitions'
import { useAppDispatch, useAppSelector } from '../../../../hooks'

const NumberOfCompetitions: React.FC = () => {
  const competitions = useAppSelector((state) => state.competitions.competitions)
  const dispatch = useAppDispatch()

  const handleCount = () => {
    if (competitions.length >= 1000000) {
      ;<div>{competitions.length / 1000000 + 'M'}</div>
    } else if (competitions.length >= 1000) {
      ;<div>{competitions.length / 1000 + 'K'}</div>
    }
    return <div>{competitions.length}</div>
  }

  useEffect(() => {
    dispatch(getCompetitions())
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
