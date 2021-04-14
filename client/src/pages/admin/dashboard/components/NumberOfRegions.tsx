import { Box, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { getSearchUsers } from '../../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../../hooks'

const NumberOfRegions: React.FC = () => {
  const competitionTotal = useAppSelector((state) => state.competitions.total)
  const dispatch = useAppDispatch()

  const handleCount = () => {
    if (competitionTotal >= 1000000) {
      ;<div>{competitionTotal / 1000000 + 'M'}</div>
    } else if (competitionTotal >= 1000) {
      ;<div>{competitionTotal / 1000 + 'K'}</div>
    }
    return <div>{competitionTotal}</div>
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

export default NumberOfRegions
