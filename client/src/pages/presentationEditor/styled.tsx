import { Button, ListItem, Toolbar } from '@material-ui/core'
import styled from 'styled-components'

export const ToolBarContainer = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`

export const ViewButton = styled(Button)`
  margin-right: 8px;
`

export const ViewButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`

export const SlideListItem = styled(ListItem)`
  text-align: center;
  height: 60px;
`

export const PresentationEditorContainer = styled.div`
  height: 100%;
`

export const CenteredSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
