import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAppSelector } from '../hooks'
import { CheckAuthenticationAdmin } from './checkAuthenticationAdmin'
import { CheckAuthenticationCompetition } from './checkAuthenticationCompetition'

interface SecureRouteProps extends RouteProps {
  component: React.ComponentType<any>
  rest?: any
  authLevel: 'admin' | 'login' | 'Operator' | 'Team' | 'Judge' | 'Audience'
}

/** Utility component to use for authentication, replace all routes that should be private with secure routes*/
const SecureRoute: React.FC<SecureRouteProps> = ({ component: Component, authLevel, ...rest }: SecureRouteProps) => {
  const userAuthenticated = useAppSelector((state) => state.user.authenticated)
  const compAuthenticated = useAppSelector((state) => state.competitionLogin.authenticated)
  const [initialized, setInitialized] = React.useState(false)
  const compInitialized = useAppSelector((state) => state.competitionLogin.initialized)
  const viewType = useAppSelector((state) => state.competitionLogin.data?.view)
  React.useEffect(() => {
    if (authLevel === 'admin' || authLevel === 'login') {
      CheckAuthenticationAdmin().then(() => setInitialized(true))
    } else {
      CheckAuthenticationCompetition(authLevel).then(() => setInitialized(true))
    }
  }, [])

  if (initialized) {
    if (authLevel === 'login')
      return (
        <Route
          {...rest}
          render={(props) => (userAuthenticated ? <Redirect to="/admin" /> : <Component {...props} />)}
        />
      )
    else if (compInitialized && viewType && authLevel !== 'admin') {
      return (
        <Route
          {...rest}
          render={(props) =>
            compAuthenticated && viewType === authLevel ? <Component {...props} /> : <Redirect to="/" />
          }
        />
      )
    } else
      return (
        <Route {...rest} render={(props) => (userAuthenticated ? <Component {...props} /> : <Redirect to="/" />)} />
      )
  } else return null
}
export default SecureRoute
