import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class Register extends Component {
  constructor () {
    super()
    this.state = {
      registerUsername: '',
      registerPassword: '',
      registerConfirmPassword: '',
      redirect: false
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { registerUsername, registerPassword, registerConfirmPassword } = this.state

    if (registerPassword !== registerConfirmPassword) {
      alert('Passwords do not match!')
      this.setState({ registerPassword: '', registerConfirmPassword: '' })
    } else {
      var data = { username: registerUsername, password: registerPassword }

      axios.post('/auth/register', data).then((result) => {
        if (result.data === true) {
          this.setState({ redirect: result.data })
        } else {
          console.log('An error occured creating new local user: ' + result.data)
          this.setState({ redirect: false })
        }
      })
    }
  }

  render () {
    const { registerUsername, registerPassword, registerConfirmPassword, redirect } = this.state

    if (redirect) {
      return <Redirect to='/login' />
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
                <Link to='./login'>
                  <button className='nav-button'>
                  Login
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
          <form onSubmit={this.onSubmit}>
            <h1>Register Account</h1>
            <input
              type='text'
              name='registerUsername'
              placeholder='Username'
              value={registerUsername}
              onChange={this.onChange}
              required
              autoFocus={true}
            />
            <br />
            <input
              type='password'
              name='registerPassword'
              placeholder='Password'
              value={registerPassword}
              onChange={this.onChange}
              required
            />
            <br />
            <input
              type='password'
              name='registerConfirmPassword'
              placeholder='Confirm Password'
              value={registerConfirmPassword}
              onChange={this.onChange}
              required
            />
            <br />
            <button className='logreg-button' type='submit'>Register</button>
          </form>
        </div>
      )
    }
  }
}

export default Register
