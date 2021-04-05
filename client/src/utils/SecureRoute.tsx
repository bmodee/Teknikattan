import React, { useEffect } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAppSelector } from '../hooks'
import { CheckAuthentication } from './checkAuthentication'

interface SecureRouteProps extends RouteProps {
  login?: boolean
  component: React.ComponentType<any>
  rest?: any
}
/** Utility component to use for authentication, replace all routes that should be private with secure routes*/
const SecureRoute: React.FC<SecureRouteProps> = ({ login, component: Component, ...rest }: SecureRouteProps) => {
  const authenticated = useAppSelector((state) => state.user.authenticated)
  const [initialized, setInitialized] = React.useState(false)
  useEffect(() => {
    const waitForAuthentication = async () => {
      await CheckAuthentication()
      setInitialized(true)
    }
    waitForAuthentication()
  }, [])
  if (initialized) {
    if (login)
      return (
        <Route {...rest} render={(props) => (authenticated ? <Redirect to="/admin" /> : <Component {...props} />)} />
      )
    else return <Route {...rest} render={(props) => (authenticated ? <Component {...props} /> : <Redirect to="/" />)} />
  } else return null
}
export default SecureRoute
