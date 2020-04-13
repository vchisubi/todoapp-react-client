import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class Login extends Component {
  constructor () {
    super()
    this.state = {
      loginUsername: '',
      loginPassword: '',
      redirect: false,
      loggedIn: false
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { loginUsername, loginPassword } = this.state
    var data = { username: loginUsername, password: loginPassword }

    axios.post('/auth/login', data).then((result) => {
      console.log(result.data)
      if (result.data === true) {
        this.setState({ redirect: result.data, loggedIn: true })
      } else {
        console.log('An error occured logging in as a local user: ' + result.data)
        this.setState({ redirect: false })
      }
    })
  }

  render () {
    const { loginUsername, loginPassword, redirect, loggedIn } = this.state

    if (redirect || loggedIn) {
      console.log('[Redirecting to list]')
      return <Redirect to='/list' />
    } else {
      return (
        <div className='App'>
          <nav>
            <ul>
              <li>
                <Link to='./'>
                  <button className='nav-button'>
                  Home
                  </button>
                </Link>
              </li>
              <li>
                <Link to='./register'>
                  <button className='nav-button'>
                  Register
                  </button>
                </Link>
              </li>
            </ul>
          </nav>

          <form onSubmit={this.onSubmit}>
            <h1>Login as Local User</h1>
            <input
              type='text'
              name='loginUsername'
              placeholder='Username'
              value={loginUsername}
              onChange={this.onChange}
              required
            />
            <br />
            <input
              type='password'
              name='loginPassword'
              placeholder='Password'
              value={loginPassword}
              onChange={this.onChange}
              required
            />
            <br />
            <button className='logreg-button' type='submit'>Login</button>
          </form>
          <br />
          <a className='google-button' href='http://localhost:4002/auth/google'> Google+ </a>
        </div>
      )
    }
  }
}

export default Login
