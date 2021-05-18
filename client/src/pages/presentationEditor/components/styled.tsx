import { Button, Card, List, ListItemText, Tab, TextField, Typography } from '@material-ui/core'
import styled from 'styled-components'

export const SettingsTab = styled(Tab)`
  height: 64px;
  min-width: 195px;
`

export const SlideEditorContainer = styled.div`
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SlideEditorContainerRatio = styled.div`
  width: 100%;
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

export const FirstItem = styled.div`
  width: 100%;
  padding-top: 10px;
`

export const AlternativeTextField = styled(TextField)`
  width: 87%;
`

export const Center = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
`

export const ImageTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const PanelContainer = styled.div`
  padding: 10px;
  width: 100%;
`

export const AddButton = styled(Typography)`
  padding: 7px 8px 7px 8px;
`

export const ImportedImage = styled.img`
  width: 70px;
  height: 50px;
`

export const Clickable = styled.div`
  cursor: pointer;
`

export const AddImageButton = styled.label`
  padding: 8px 13px 8px 13px;
  display: flex;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
`

export const AddBackgroundButton = styled.label`
  padding: 16px 29px 16px 29px;
  display: flex;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
`

export const SettingsList = styled(List)`
  margin-bottom: 10px;
  padding: 0;
  background: white;
`

export const TextCard = styled(Card)`
  margin-bottom: 15px;
  margin-top: 10px;
`

export const DeleteTextButton = styled(Button)`
  width: 100%;
  margin-bottom: 7px;
`

interface HoverContainerProps {
  hover: boolean
}

export const HoverContainer = styled.div<HoverContainerProps>`
  height: 100%;
  width: 100%;
  padding: ${(props) => (props.hover ? 0 : 1)}px;
  border: solid ${(props) => (props.hover ? 1 : 0)}px;
`

export const ImageNameText = styled(ListItemText)`
  word-break: break-all;
`

export const QuestionComponent = styled.div`
  outline-style: double;
`

export const SettingsItemContainer = styled.div`
  padding: 5px;
`

interface SlideDisplayTextProps {
  $scale: number
  $right?: boolean
}

export const SlideDisplayText = styled(Typography)<SlideDisplayTextProps>`
  position: absolute;
  top: 5px;
  left: ${(props) => (props.$right ? undefined : 5)}px;
  right: ${(props) => (props.$right ? 5 : undefined)}px;
  font-size: ${(props) => 24 * props.$scale}px;
`
