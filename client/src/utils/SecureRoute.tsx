import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { CheckAuthentication } from './checkAuthentication'

interface SecureRouteProps extends RouteProps {
  login?: boolean
  component: any
  authenticated: boolean
  rest?: any
}
/** Utility component to use for authentication, replace all routes that should be private with secure routes*/
const SecureRoute: React.FC<SecureRouteProps> = ({ login, component: Component, authenticated, ...rest }: any) => {
  const [isReady, setReady] = useState(false)
  useEffect(() => {
    CheckAuthentication().then(() => setReady(true))
  }, [])
  if (isReady) {
    console.log(login, authenticated, Component)
    if (login)
      return (
        <Route {...rest} render={(props) => (authenticated ? <Redirect to="/admin" /> : <Component {...props} />)} />
      )
    else return <Route {...rest} render={(props) => (authenticated ? <Component {...props} /> : <Redirect to="/" />)} />
  } else return null
}
const mapStateToProps = (state: any) => ({
  authenticated: state.user.authenticated,
})
export default connect(mapStateToProps)(SecureRoute)
