import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'
import LoginForm from './components/Login'
import TestConnection from './components/TestConnection'

const App: React.FC = () => {
  return (
    <div className="wrapper">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <h1>Application</h1>
      <TestConnection />
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <LoginForm />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
