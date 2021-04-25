import {
  FormControl,
  List,
  Tab,
  TextField,
  Typography,
  Button,
  Card,
  ListItem,
  Select,
  InputLabel,
} from '@material-ui/core'
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

export const FormControlDropdown = styled(FormControl)`
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  padding-left: 16px;
  padding-right: 16px;
`

export const SlideTypeInputLabel = styled(InputLabel)`
  width: 100%;
  padding: 10px;
  padding-left: 22px;
`

export const TextInput = styled(TextField)`
  width: 87%;
`

export const NoPadding = styled.div`
  padding: 0;
  height: 100%;
  width: 100%;
`

export const Center = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
`

export const SlidePanel = styled.div`
  padding: 10px;
  width: 100%;
`

export const WhiteBackground = styled.div`
  background: white;
`

export const AddButton = styled(Typography)`
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 7px;
  padding-bottom: 7px;
`

export const ImportedImage = styled.img`
  width: 70px;
  height: 50px;
`

export const Clickable = styled.div`
  cursor: pointer;
`

export const AddImageButton = styled.label`
  padding: 0;
  cursor: 'pointer';
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
