import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Clock from 'react-live-clock'
import axios from 'axios'
import '../../App/App.css'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false,
      loggedInDisplay: 'false',
      loggedInAs: '',
      profilePic: ''
    }
  }

  handleLogout = () => {
    axios.get('/auth/logout').then((res) => {
      if (res.data) {
        this.setState({ loggedIn: false, loggedInDisplay: 'false', loggedInAs: '' })
      }
    })
  }

  checkAuth = () => {
    axios.get('/auth/authCheck').then((res) => {
      this.setState({ loggedIn: res.data, loggedInDisplay: res.data.toString() })
    })
    axios.get('/auth/authCheckUser').then((res) => {
      this.setState({ loggedInAs: res.data.username, profilePic: res.data.thumbnail })
    })
  }

  componentDidMount () {
    this.checkAuth()
  }

  render () {
    let viewButton
    let profileButton

    if (!this.state.loggedIn) {
      viewButton =
        <li>
          <Link to='./login'>
            <button className='nav-button'>
            Login
            </button>
          </Link>
        </li>
      profileButton = <h2>Login Status: False</h2>
    } else {
      viewButton =
        <div>
          <li>
            <Link to='./list'>
              <button className='nav-button'>
              My List
              </button>
            </Link>
          </li>
          <li>
            <button className='nav-button' onClick={this.handleLogout}>Log Out</button>
          </li>
        </div>
      profileButton =
        <div>
          <h2>Login Status: {this.state.loggedInDisplay} - {this.state.loggedInAs}</h2>
          <img
            src={this.state.profilePic}
            height='10%'
            width='10%'
          />
        </div>
    }

    return (
      <div className='App'>
        <nav>
          <ul>
            {viewButton}
          </ul>
        </nav>
        <Clock
          format='HH:mm:ss'
          timezone='US/Pacific'
          style={{ fontSize: '250px' }}
        />
        {profileButton}
      </div>
    )
  }
}
