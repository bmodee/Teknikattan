import { Box, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { getCities } from '../../../../actions/cities'
import { useAppDispatch, useAppSelector } from '../../../../hooks'

const NumberOfRegions: React.FC = () => {
  const regions = useAppSelector((state) => state.cities.total)
  const dispatch = useAppDispatch()

  const handleCount = () => {
    if (regions >= 1000000) {
      ;<div>{regions / 1000000 + 'M'}</div>
    } else if (regions >= 1000) {
      ;<div>{regions / 1000 + 'K'}</div>
    }
    return <div>{regions}</div>
  }

  useEffect(() => {
    dispatch(getCities())
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
