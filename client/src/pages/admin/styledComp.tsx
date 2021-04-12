import { Button, MenuItem, TextField } from '@material-ui/core'
import styled from 'styled-components'

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const AddButton = styled(Button)`
  margin-bottom: 8px;
`

export const AddForm = styled.form`
  display: flex;
  flex-direction: column;
`

export const AddContent = styled.div`
  padding: 25px;
  padding-bottom: 40px;
  width: 300px;
`

export const RemoveMenuItem = styled(MenuItem)`
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
