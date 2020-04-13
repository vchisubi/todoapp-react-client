import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import Controllers from '../controllers/controllers'
import InputField from '../inputs/inputField'
import TodoItem from '../views/components/taskItem'
import ButtonComponents from '../views/buttons/buttons'
import axios from 'axios'

class List extends React.Component {
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
    this.handleClear = this.handleClear.bind(this)
  }

  componentDidMount () {
    this.getTodoList()
  }

  getTodoList = () => {
    this.myController.updateAndSort()
      .then(result => {
        this.setState({ todos: result })
      })
  }

  showAll = () => {
    this.getTodoList()
  }

  showActive = () => {
    const updatedTodos = []
    this.myController.updateAndSort()
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
    this.myController.updateAndSort()
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
  handleChange (inputId) {
    console.log('Checked')
    this.setState(prevState => {
      // Use .map() to go thru each todo and look for the target todo via id
      const updatedTodos = prevState.todos.map(todo => {
        if (todo.id === inputId) {
          // Set the completed attribute to the opposite of what it was before
          todo.completed = !todo.completed
          // update the task object im the remote db
          this.myController.patchTask(inputId, todo.completed)
        }
        // puts the original todo in the mapped array
        return todo
      })
      // Set the todos to the newly updated todos array with the changed item
      return { todos: updatedTodos }
    })
  }

  // Handles deletion of a task
  handleClick (inputId) {
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

  handleClear () {
    this.myController.obliterateAll()
    this.setState({ todos: [] })
  }

  handleInput = e => {
    this.setState({ inputfield: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.inputfield === '') {
      alert('Please enter a task!')
    } else {
      this.myController.postTodo(this.state.inputfield)
      this.myController.updateAndSort().then(result => {
        this.setState({ inputfield: '', todos: result })
        this.getTodoList()
      })
    }
  }

  handleLogout = () => {
    axios.get('/auth/logout').then((res) => {
      if (res.data) {
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
