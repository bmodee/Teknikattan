import { Drawer, DrawerProps } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

interface leftDrawerProps extends DrawerProps {
  width: number
}
export const LeftDrawer = styled((props: leftDrawerProps) => <Drawer {...props} />)`
  width: ${(props) => (props.width ? props.width : '500px')};
  flex-shrink: 0;
  margin-right: ${(props) => (props.width ? props.width : '500px')};
  z-index: 1;
`
