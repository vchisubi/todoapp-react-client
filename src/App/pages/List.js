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
    this.showAll = this.showAll.bind(this)
    this.showActive = this.showActive.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // Fetch the list on first mount
  componentDidMount () {
    this.getTodoList()
  }

  getTodoList = () => {
    console.log('Fetch List')
    const myController = new Controllers()
    myController.updateAndSort()
      .then(result => {
        this.setState({ todos: result })
      })
  }

  // rerender = () => {
  //   let updatedTodos = []
  //   this.setState(prevState => {
  //     const myController = new Controllers()
  //     myController.updateAndSort()
  //       .then(result => {
  //         updatedTodos = result
  //         return { todos: updatedTodos }
  //       })
  //   })
  // }

  showAll = () => {
    console.log('show all')
    this.getTodoList()
  }

  showActive = () => {
    console.log('Show Active')
    const updatedTodos = []
    const myController = new Controllers()
    myController.updateAndSort()
      .then(result => {
        result.map(todo => {
          if (todo.completed === false) {
            // console.log(updatedTodos)
            updatedTodos.push(todo)
          }
          this.setState({ todos: updatedTodos })
        })
      })
  }

  showComplete = () => {
    console.log('Show Complete')
    const updatedTodos = []
    const myController = new Controllers()
    myController.updateAndSort()
      .then(result => {
        result.map(todo => {
          if (todo.completed === true) {
            // console.log(updatedTodos)
            updatedTodos.push(todo)
          }
          this.setState({ todos: updatedTodos })
        })
      })
  }

  // for CHECKBOX
  handleChange (inputId) {
    console.log('Checkboxed')
    this.setState(prevState => {
      // Use .map() to go thru each todo and look for the target todo via id
      const updatedTodos = prevState.todos.map(todo => {
        if (todo.id === inputId) {
          // Set the completed attribute to the opposite of what it was before
          todo.completed = !todo.completed
          // update the task object im the remote db
          const myController = new Controllers()
          myController.patchTask(inputId, todo.completed)
        }
        // puts the original todo in the mapped array
        return todo
      })
      // Set the todos to the newly updated todos array with the changed item
      return { todos: updatedTodos }
    })
  }

  // for DELETE
  handleClick (inputId) {
    console.log('Deleted')
    const updatedTodos = []
    this.setState(prevState => {
      prevState.todos.map(todo => {
        if (todo.id === inputId) {
          const myController = new Controllers()
          myController.obliterateTask(inputId)
        } else {
          updatedTodos.push(todo)
        }
        return todo
      })
      return { todos: updatedTodos }
    })
  }

  handleClear () {
    this.setState(prevState => {
      // const myController = new Controllers()
      // myController.obliterateAll()
      this.myController.obliterateAll()
      return { todos: [] }
    })
  }

  handleInput = event => {
    // this.setState({ inputfield: event.target.value })
    const { name, value, type } = event.target
    if (type === 'text' && name === 'userInput') {
      this.setState({ inputfield: value })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.inputfield === '') {
      alert('Please enter a task!')
    } else {
      const tempState = this.state.inputfield
      console.log(tempState)
      const myController = new Controllers()
      // POST todo
      myController.postTodo(this.state.inputfield)
      myController.updateAndSort().then(result => {
        this.setState({ todos: result, inputfield: '' })
      })
      // this.setState({ inputField: '' })
    }
  }

  render () {
    // const { todos } = this.state
    // props are passed to TodoItem.js thru here
    const todoItems = this.state.todos.map(item =>
      <TodoItem
        key={item._id}
        item={item}
        handleChange={this.onCheckboxChange}
        handleClick={this.onDeleteTask}
      />)

    return (
      <div className='App'>
        {/* <InputField
          onSubmit={this.handleSubmit}
        /> */}

        <header className='App-header'>

          <div className='todo-list'>
            <InputField2
              handleSubmit={this.handleSubmit}
              handleInput={this.handleInput}
              data={this.state.inputfield}
            />
            {/* <form onSubmit={this.handleSubmit}>
              <input
                onChange={this.handleInput}
                type='text'
                value={this.state.inputField}
                name='userInput'
              />
              <br />
              <button className='submit-button'>Submit</button>
            </form> */}
            <ul>
              {todoItems}
            </ul>
          </div>

          {/* <div className='button-container'>
            <button className='view-button' onClick={this.showAll}>Show All Tasks</button>
            <button className='view-button' onClick={this.showActive}>Show Active Tasks</button>
            <button className='view-button' onClick={this.showComplete}>Show Active Tasks</button>
            <button className='view-button' onClick={this.handleClear}>Clear All Tasks</button>
          </div> */}
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
