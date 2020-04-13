import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import List from './pages/List'
import ProtectedRoute from './views/components/ProtectedRoute'
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount () {
    this.checkAuth()
  }

  checkAuth = () => {
    axios.get('/auth/authCheck').then((res) => {
      this.setState({ loggedIn: res.data })
    })
  }

  render () {
    return (
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <ProtectedRoute path='/list' component={List} />
      </Switch>
    )
  }
}

export default App
