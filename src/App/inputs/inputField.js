import React, { Component } from 'react'
import Controllers from '../controllers/controllers'

export default class InputField extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputField: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = e => {
    this.setState({ inputField: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.inputField === '') {
      alert('Please enter a task!')
    } else {
      const tempState = this.state.inputField
      console.log(tempState)
      const myController = new Controllers()
      // POST todo
      myController.postTodo(this.state.inputField)
      this.setState({ inputField: '' })
    }
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          onChange={this.handleChange}
          type='text'
          value={this.state.inputField}
          name='userInput'
        />
        <br />
        <button>Submit</button>
      </form>
    )
  }
}
