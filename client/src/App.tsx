import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { teal } from '@material-ui/core/colors'
import React from 'react'
import './App.css'
import Main from './Main'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#6200EE',
    },
    secondary: {
      main: teal.A400,
    },
  },
})

const App: React.FC = () => {
  return (
    <div className="wrapper">
      <ThemeProvider theme={theme}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <Main />
      </ThemeProvider>
    </div>
  )
}

export default App
