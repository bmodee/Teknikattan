import { AppBar, Button, Drawer, List, ListItem, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'

interface ViewButtonProps {
  $activeView: boolean
}

interface DrawerSizeProps {
  $leftDrawerWidth: number | undefined
  $rightDrawerWidth: number | undefined
}

const AppBarHeight = 64
const SlideListHeight = 60

export const ToolBarContainer = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding-left: 0;
`

export const ViewButton = styled(Button)<ViewButtonProps>`
  background: ${(props) => (props.$activeView ? '#5a0017' : undefined)};
`

export const ViewButtonClicked = styled(Button)`
  background: #5a0017;
`

export const SlideList = styled(List)`
  height: calc(100% - ${SlideListHeight}px);
  padding: 0px;
  overflow-y: auto;
`

export const RightPanelScroll = styled(List)`
  padding: 0px;
  overflow-y: auto;
`

export const SlideListItem = styled(ListItem)`
  text-align: center;
  height: ${SlideListHeight}px;
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
  height: ${AppBarHeight}px;
`

export const LeftDrawer = styled(Drawer)<DrawerSizeProps>`
  width: ${(props) => (props ? props.$leftDrawerWidth : 0)}px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
`

export const RightDrawer = styled(Drawer)<DrawerSizeProps>`
  width: ${(props) => (props ? props.$rightDrawerWidth : 0)}px;
  flex-shrink: 0;
`

export const AppBarEditor = styled(AppBar)<DrawerSizeProps>`
  width: calc(100% - ${(props) => (props ? props.$rightDrawerWidth : 0)}px);
  left: 0;
  margin-left: $leftDrawerWidth;
  margin-right: $rightDrawerWidth;
`

// Necessary for content to be below app bar
export const ToolbarMargin = styled.div`
  padding-top: ${AppBarHeight}px;
`

export const FillLeftContainer = styled.div<DrawerSizeProps>`
  width: ${(props) => (props ? props.$leftDrawerWidth : 0)}px;
  height: calc(100% - ${SlideListHeight}px);
  overflow: hidden;
`

export const FillRightContainer = styled.div<DrawerSizeProps>`
  width: ${(props) => (props ? props.$rightDrawerWidth : 0)}px;
  height: 100%;
  overflow-y: auto;
  background: #e9e9e9;
`

export const PositionBottom = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`

export const CompetitionName = styled(Typography)`
  text-decoration: none;
  position: absolute;
  left: 180px;
`
