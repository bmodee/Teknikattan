import { Box, Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../../../hooks'

const NumberOfCompetitions: React.FC = () => {
  const competitions = useAppSelector((state) => state.statistics.competitions)

  const handleCount = () => {
    if (competitions >= 1000000) {
      ;<div>{competitions / 1000000 + 'M'}</div>
    } else if (competitions >= 1000) {
      ;<div>{competitions / 1000 + 'K'}</div>
    }
    return <div>{competitions}</div>
  }

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
