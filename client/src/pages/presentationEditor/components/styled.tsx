import { Button, Card, Tab } from '@material-ui/core'
import styled from 'styled-components'

export const SettingsTab = styled(Tab)`
  height: 64px;
  min-width: 195px;
`

export const SlideEditorContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.08);
`

export const SlideEditorContainerRatio = styled.div`
  padding-top: 56.25%;
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
`

export const SlideEditorPaper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
`

export const HiddenInput = styled.input`
  display: none;
`

export const SettingsContainer = styled.div`
  overflow-x: hidden;
`

export const ToolbarPadding = styled.div`
  height: 0;
  padding-top: 55px;
`

export const TextCard = styled(Card)`
  margin-bottom: 15px;
  margin-top: 10px;
`

export const DeleteTextButton = styled(Button)`
  width: 100%;
  margin-bottom: 7px;
`

interface TextComponentContainerProps {
  hover: boolean
}

export const TextComponentContainer = styled.div<TextComponentContainerProps>`
  height: 100%;
  width: 100%;
  border: solid ${(props) => (props.hover ? 1 : 0)}px;
`
