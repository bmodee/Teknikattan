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
