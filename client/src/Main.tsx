import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AdminView from './components/AdminView'
import LoginForm from './components/Login'

const Main = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginForm} />
        <Route path="/admin" component={AdminView} />
      </Switch>
    </BrowserRouter>
  )
}

export default Main
