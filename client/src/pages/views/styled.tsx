import { AppBar, Button, Card, Drawer, Toolbar, Typography } from '@material-ui/core'
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
  margin-right: 304px;
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

export const OperatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 120px;
  width: 100%;
  position: absolute;
`

export const OperatorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  height: 140px;
  position: absolute;
  bottom: 0;
  width: 100%;
`

export const OperatorButton = styled(Button)`
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

export const OperatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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
  width: 100%;
  height: 100%;
  max-width: calc(100% - ${(props) => (props ? props.leftDrawerWidth + props.rightDrawerWidth : 0)}px);
  max-height: calc(100% - 64px);
  margin-left: ${(props) => (props ? props.leftDrawerWidth : 0)}px;
  margin-right: ${(props) => (props ? props.rightDrawerWidth : 0)}px;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.08);
`

export const InnerContent = styled.div`
  width: 100%;
  /* Makes sure width is not bigger than where a 16:9 display can fit 
  without overlapping with header */
  max-width: calc(((100vh - 64px) / 9) * 16);
`

export const OperatorContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.08);
`

export const OperatorInnerContent = styled.div`
  height: 100%;
  width: 100%;
  /* Makes sure width is not bigger than where a 16:9 display can fit 
  without overlapping with header and footer */
  max-width: calc(((100vh - 260px) / 9) * 16);
`

export const PresentationContainer = styled.div`
  height: 100%;
  width: 100%;
  max-width: calc((100vh / 9) * 16);
`

export const PresentationBackground = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
`

interface ScoreHeaderPaperProps {
  $rightDrawerWidth: number
}

export const ScoreHeaderPaper = styled(Card)<ScoreHeaderPaperProps>`
  position: absolute;
  top: 66px;
  width: ${(props) => (props ? props.$rightDrawerWidth : 0)}px;
  height: 71px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`

export const ScoreHeaderPadding = styled.div`
  min-height: 71px;
`

export const ScoreFooterPadding = styled.div`
  min-height: 250px;
`
