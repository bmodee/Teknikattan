import { createMuiTheme, MuiThemeProvider, StylesProvider } from '@material-ui/core'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import Main from './Main'
import { Wrapper } from './styled'

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
      <Wrapper>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <Main />
          </ThemeProvider>
        </MuiThemeProvider>
      </Wrapper>
    </StylesProvider>
  )
}

export default App
