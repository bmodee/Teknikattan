/**
 * A component that wraps Main.tsx in a theme
 */

import {
  MuiThemeProvider,
  StylesProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core'
// unstable version of createMuiTheme is required for React.StrictMode currently
import React from 'react'
import { ThemeProvider } from 'styled-components'
import Main from './Main'
import { Wrapper } from './styled'

/** Create a theme for the application with the colors specified by customer */
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#11064D',
    },
    secondary: {
      main: '#A6141D',
    },
  },
})

const App: React.FC = () => {
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <Wrapper>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <Main />
          </Wrapper>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  )
}

export default App
