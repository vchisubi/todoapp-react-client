import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import axios from 'axios'

class ProtectedRoute extends Component {
  state = {
    loggedIn: false,
    loaded: false
  }

  componentDidMount () {
    this.checkAuth()
  }

  checkAuth = () => {
    axios.get('/auth/authCheck').then((res) => {
      this.setState({ loggedIn: res.data, loaded: true })
    })
  }

  render () {
    const { component: Component, ...rest } = this.props
    const { loaded, loggedIn } = this.state
    if (!loaded) return null
    return (
      <Route
        {...rest}
        render={props => {
          return loggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login'
              }}
            />
          )
        }}
      />
    )
  }
}

export default ProtectedRoute
