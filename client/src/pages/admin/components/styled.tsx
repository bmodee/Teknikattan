import { Button, MenuItem } from '@material-ui/core'
import styled from 'styled-components'

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const NewCompetitionButton = styled(Button)`
  margin-bottom: 8px;
`

export const RemoveCompetition = styled(MenuItem)`
  color:red;
`


