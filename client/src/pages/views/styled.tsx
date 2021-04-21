import { AppBar, Button, Drawer, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'

export const JudgeAppBar = styled(AppBar)`
  z-index: 9000;
`

export const JudgeToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`

export const JudgeQuestionsLabel = styled(Typography)`
  margin-left: 15px;
`

export const JudgeAnswersLabel = styled(Typography)`
  margin-right: 160px;
`

export const ViewSelectContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12%;
  height: 100%;
`

export const ViewSelectButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: max-content;
  height: 140px;
  margin-left: auto;
  margin-right: auto;
`

export const PresenterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100%;
`

export const PresenterFooter = styled.div`
  display: flex;
  justify-content: space-between;
`

export const PresenterButton = styled(Button)`
  width: 100px;
  height: 100px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
`

export const SlideCounter = styled(Button)`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
`

export const PresenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

export const ToolBarContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: auto;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 20px;
`

interface DrawerProps {
  width: number
}

export const LeftDrawer = styled(Drawer)<DrawerProps>`
  flex-shrink: 0;
  position: 'relative';
  z-index: -5;
  width: ${(props) => (props ? props.width : 150)};
`

export const RightDrawer = styled(Drawer)<DrawerProps>`
  width: ${(props) => (props ? props.width : 150)};
  flex-shrink: 0;
  z-index: 1;
`

interface ContentProps {
  leftDrawerWidth: number
  rightDrawerWidth: number
}

export const Content = styled.div<ContentProps>`
  margin-left: ${(props) => (props ? props.leftDrawerWidth : 0)}px;
  margin-right: ${(props) => (props ? props.rightDrawerWidth : 0)}px;
  width: calc(100% - ${(props) => (props ? props.leftDrawerWidth + props.rightDrawerWidth : 0)}px);
  height: calc(100% - 64px);
`
