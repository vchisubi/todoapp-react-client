import React from 'react'
import axios from 'axios'
import List from '../pages/List'

export default class Controllers extends React.Component {
  constructor () {
    super()
    // Store the models here or separately?
    this.state = {
      allTasks: [],
      activeTasks: [],
      doneTasks: []
    }
  }

  updateAndSort = async () => {
    // AXIOS works
    // axios.get('/api/todos').then(function (response) {
    //   console.log('from axios:')
    //   console.log(response)
    // })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    //   .finally(function () {
    //     console.log('end')
    //   })
    // this.setState({ allTasks: [] })
    const resultArray = await fetch('/api/todos').then(res => res.json())
    const sortedArray = resultArray.sort(function (a, b) { return a._id - b._id })
    this.setState({ alltasks: sortedArray })
    return sortedArray
  }

  updateActiveTasks = async () => {
    // get all tasks, then push the incompleted items to the activeTasks array
    const resultArray = []
    await this.updateAndSort().then(result => {
      result.forEach(function (todoItem) {
        if (todoItem.completed === true) {
          resultArray.push(todoItem)
        }
      })
    })
    console.log('incompleted tasks:')
    // console.log(this.state.activeTasks)
    return resultArray
  }

  updateCompletedTasks = async () => {
    const resultArray = []
    await this.updateAndSort().then(result => {
      result.forEach(function (todoItem) {
        if (todoItem.completed === false) {
          resultArray.push(todoItem)
        }
      })
    })
    console.log('completed tasks:')
    return resultArray
  }

  // postTodo = (inputField) => {
  //   const data = {}
  //   data.title = inputField
  //   data.completed = false
  //   axios.post('/api/todos', data)
  //     .then(function (response) {
  //       // console.log(response)
  //       console.log('Added: ' + data.title)
  //     })
  //     .catch(function (error) {
  //       console.log(error)
  //     }).then(this.updateAndSort()
  //       .then((resultArray) => {
  //         const rerenderer = new List()
  //         rerenderer.rerender(resultArray)
  //       }))
  // }

  postTodo = (inputField) => {
    const rerenderer = new List()
    const data = {}
    data.title = inputField
    data.completed = false
    axios.post('/api/todos', data)
      .then(function (response) {
        console.log('Added: ' + data.title)
      })
      .catch(function (error) {
        console.log(error)
      })
    rerenderer.getTodoList()
  }

  obliterateTask = (id) => {
    axios.delete('api/todos/' + id).then(function (response) {
      console.log('Deleting: ' + id)
    })
      .catch(function (error) {
        console.log(error)
      }).then(
        this.updateAndSort())
  }

  obliterateAll = () => {
    axios.delete('api/todos').then(function (response) {
      console.log(response.data)
    })
      .catch(function (error) {
        console.log(error)
      })
      // .then(this.setState({ allTasks: [], activeTasks: [], doneTasks: [] }))
  }

  patchTask = (id, toggle) => {
    const data = {}
    data.id = id
    data.completed = toggle
    console.log('Patching: ' + id)
    axios.patch('api/todos/' + id, data).then(function (response) {
    })
      .catch(function (error) {
        console.log(error)
      }).then(
        this.updateAndSort())
  }

  // getAllTodos = () => {
  //   const resultArray = fetch('/api/todos').then(res => res.json())
  //   return resultArray
  // }
}
