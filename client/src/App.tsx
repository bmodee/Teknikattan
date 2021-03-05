import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import React from 'react'
import './App.css'
import Main from './Main'

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#6200EE',
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
