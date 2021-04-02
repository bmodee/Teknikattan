import { Button, MenuItem, TextField } from '@material-ui/core'
import styled from 'styled-components'

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const AddCompetitionButton = styled(Button)`
  margin-bottom: 8px;
`

export const AddCompetitionForm = styled.form`
  display: flex;
  flex-direction: column;
`

export const AddCompetitionContent = styled.div`
  padding: 15px;
`

export const RemoveCompetition = styled(MenuItem)`
  color: red;
`

export const YearFilterTextField = styled(TextField)`
  width: 70px;
`

export const FilterContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin: left 10px;
`
