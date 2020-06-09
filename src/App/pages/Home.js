import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Clock from 'react-live-clock'
import axios from 'axios'

import { AuthUserContext } from '../context/authUser'
import '../../App/App.css'
import digikat from '../assets/images/digikat.png'

export default class Home extends Component {
  static contextType = AuthUserContext

  handleLogout = () => {
    axios.get('/auth/logout').then((res) => {
      if (res.data) {
        this.context.setContext({ username: 'No User' }, 'Logged Out, Dummy')
      }
    })
  }

  render () {
    let viewButton
    let profileButton

    if (!this.context.loggedIn) {
      viewButton =
        <li>
          <Link to='./login'>
            <button className='nav-button'>
            Login
            </button>
          </Link>
        </li>
      profileButton = <h2>Good Day!</h2>
    } else {
      if (this.context.profileType === 'local') {
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
            <h2>Heyo, {this.context.user.username}!</h2>
            <img
              src={digikat}
              alt='ProfilePic'
              height='10%'
              width='10%'
            />
          </div>
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
            <h2>Heyo, {this.context.user.username}!</h2>
            <img
              src={this.context.user.thumbnail}
              alt='ProfilePic'
              height='10%'
              width='10%'
            />
          </div>
      }
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
