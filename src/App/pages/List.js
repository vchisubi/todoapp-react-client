import React, { Component } from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'

import Controllers from '../controllers/controllers'
import InputField from '../components/inputField'
import TodoItem from '../components/taskItem'
import ButtonComponents from '../components/Buttons/buttons'
import { AuthUserContext } from '../context/authUser'

class List extends Component {
  static contextType = AuthUserContext

  constructor (props) {
    super(props)
    this.state = {
      inputfield: '',
      todos: [],
      loggingOut: false
    }

    this.myController = new Controllers()
    this.onCheckboxChange = this.handleChange.bind(this)
    this.onDeleteTask = this.handleClick.bind(this)
  }

  componentDidMount () {
    this.getTodoList()

    setInterval(() => {
      axios.get('/auth/tokenCheck').then((res) => {
        if (res.data === false) {
          this.handleLogout()
        }
      })
    }, 900000)
  }

  getTodoList = () => {
    this.myController.updateAndSort(this.context.user._id)
      .then(result => {
        this.setState({ todos: result })
      })
  }

  showAll = () => {
    this.getTodoList()
  }

  showActive = () => {
    const updatedTodos = []
    this.myController.updateAndSort(this.context.user._id)
      .then(result => {
        result.map(todo => {
          if (todo.completed === false) {
            updatedTodos.push(todo)
          }
          this.setState({ todos: updatedTodos })
        })
      })
  }

  showComplete = () => {
    const updatedTodos = []
    this.myController.updateAndSort(this.context.user._id)
      .then(result => {
        result.map(todo => {
          if (todo.completed === true) {
            updatedTodos.push(todo)
          }
          this.setState({ todos: updatedTodos })
        })
      })
  }

  // Handles checkbox toggle for tasks
  handleChange = (inputId) => {
    this.setState(prevState => {
      // Use .map() to go thru each todo and look for the target todo via id
      const updatedTodos = prevState.todos.map(todo => {
        if (todo.id === inputId) {
          // Set the completed attribute to the opposite of what it was before
          todo.completed = !todo.completed
          // uUdate the task object im the remote db
          this.myController.patchTask(inputId, todo.completed)
        }
        // Puts the original todo in the mapped array
        return todo
      })
      // Set the todos to the newly updated todos array with the changed item
      return { todos: updatedTodos }
    })
  }

  // Handles deletion of a task
  handleClick = (inputId) => {
    const updatedTodos = []
    this.setState(prevState => {
      prevState.todos.map(todo => {
        if (todo.id === inputId) {
          this.myController.obliterateTask(inputId)
        } else {
          updatedTodos.push(todo)
        }
        return todo
      })
      return { todos: updatedTodos }
    })
  }

  handleClear = () => {
    this.myController.obliterateAll(this.context.user._id)
    this.setState({ todos: [] })
  }

  handleInput = (e) => {
    this.setState({ inputfield: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.inputfield === '') {
      alert('Please enter a task!')
    } else {
      this.myController.postTodo(this.state.inputfield, this.context.user._id)
      this.myController.updateAndSort(this.context.user._id).then(result => {
        this.setState({ inputfield: '', todos: result })
        this.getTodoList()
      })
    }
  }

  handleLogout = () => {
    axios.get('/auth/logout').then((res) => {
      if (res.data) {
        this.context.setContext({ username: 'No User' })
        this.setState({ loggingOut: true })
      }
    })
  }

  render () {
    const todoItems = this.state.todos.map(item =>
      <TodoItem
        key={item._id}
        item={item}
        handleChange={this.onCheckboxChange}
        handleClick={this.onDeleteTask}
      />)

    if (this.state.loggingOut) {
      return (
        <Redirect to='/login' />
      )
    }
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
              <button className='nav-button' onClick={this.handleLogout}>Log Out</button>
            </li>
          </ul>
        </nav>
        <header className='App-header'>
          <div className='todo-list'>
            <InputField
              handleSubmit={this.handleSubmit}
              handleInput={this.handleInput}
              data={this.state.inputfield}
            />
            <ul>
              {todoItems}
            </ul>
          </div>
          <ButtonComponents
            handleShowAll={this.showAll}
            handleShowActive={this.showActive}
            handleShowComplete={this.showComplete}
            handleClearAll={this.handleClear}
          />
        </header>
      </div>
    )
  }
}

export default List
