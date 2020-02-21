import React from 'react'
import Controllers from '../controllers/controllers'
// import InputField from '../inputs/inputField'
import InputField2 from '../inputs/inputField2'
import TodoItem from '../views/components/taskItem'
import ButtonComponents from '../views/buttons/buttons'

class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputfield: '',
      todos: [],
      activeTasks: [],
      doneTasks: []
    }

    this.myController = new Controllers()

    this.onCheckboxChange = this.handleChange.bind(this)
    this.onDeleteTask = this.handleClick.bind(this)

    // this.showAll = this.showAll.bind(this)
    // this.showActive = this.showActive.bind(this)
    this.handleClear = this.handleClear.bind(this)
    // this.handleInput = this.handleInput.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this)
  }

  // Fetch the list on first mount
  componentDidMount () {
    this.getTodoList()
  }

  getTodoList = () => {
    console.log('Fetch List')
    this.myController.updateAndSort()
      .then(result => {
        this.setState({ todos: result })
      })
  }

  showAll = () => {
    console.log('Show All')
    this.getTodoList()
  }

  showActive = () => {
    console.log('Show Active')
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
    console.log('Show Complete')
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
    console.log('Deleted')
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
    // const { name, value, type } = event.target
    // if (type === 'text' && name === 'userInput') {
    //   this.setState({ inputfield: value })
    // }
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.inputfield === '') {
      alert('Please enter a task!')
    } else {
      const tempState = this.state.inputfield
      console.log(tempState)
      // POST todo
      this.myController.postTodo(this.state.inputfield)
      this.myController.updateAndSort().then(result => {
        this.setState({ inputfield: '', todos: result })
      })
    }
  }

  render () {
    // const { todos } = this.state
    const todoItems = this.state.todos.map(item =>
      <TodoItem
        key={item._id}
        item={item}
        handleChange={this.onCheckboxChange}
        handleClick={this.onDeleteTask}
      />)

    return (
      <div className='App'>
        <header className='App-header'>
          <div className='todo-list'>
            <InputField2
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
