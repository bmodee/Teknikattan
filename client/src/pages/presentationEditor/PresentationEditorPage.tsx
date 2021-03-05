import { Typography } from '@material-ui/core'
import React from 'react'
import { useParams } from 'react-router-dom'

interface CompetitionParams {
  id: string
}

const PresentationEditorPage: React.FC = (props) => {
  const params: CompetitionParams = useParams()
  return <Typography variant="h1">tävling: {params.id}</Typography>
}

export default PresentationEditorPage
