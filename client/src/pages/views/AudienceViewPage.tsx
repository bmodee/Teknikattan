import { Typography } from '@material-ui/core'
import React from 'react'
import { useAppSelector } from '../../hooks'
import SlideDisplay from '../presentationEditor/components/SlideDisplay'

const AudienceViewPage: React.FC = () => {
  const viewTypes = useAppSelector((state) => state.types.viewTypes)
  const activeViewTypeId = viewTypes.find((viewType) => viewType.name === 'Audience')?.id
  if (activeViewTypeId) {
    return <SlideDisplay variant="presentation" activeViewTypeId={activeViewTypeId} />
  }
  return <Typography>Error: Åskådarvyn kunde inte laddas</Typography>
}

export default AudienceViewPage
