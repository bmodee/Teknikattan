import { Button, List, ListItem, Toolbar } from '@material-ui/core'
import styled from 'styled-components'

export const ToolBarContainer = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding-left: 0;
`

interface ViewButtonProps {
  $activeView: boolean
}

export const ViewButton = styled(Button)<ViewButtonProps>`
  margin-right: 8px;
  background: ${(props) => (props.$activeView ? '#5a0017' : undefined)};
`

export const ViewButtonClicked = styled(Button)`
  margin-right: 8px;
  background: #5a0017;
`

export const ViewButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`

export const SlideList = styled(List)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px;
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

export const HomeIcon = styled.img`
  height: 64px;
`
