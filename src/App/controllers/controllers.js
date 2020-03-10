import React from 'react'
import axios from 'axios'

export default class Controllers extends React.Component {
  updateAndSort = async () => {
    // const resultArray = await axios.get('/api/todos')
    //   .then(function (response) {
    //     response.json()
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    //   .finally(function () {
    //   })
    const resultArray = await fetch('/api/todos').then(res => res.json())
    const sortedArray = resultArray.sort(function (a, b) { return a._id - b._id })
    return sortedArray
  }

  updateActiveTasks = async () => {
    const resultArray = []
    await this.updateAndSort().then(result => {
      result.forEach(function (todoItem) {
        if (todoItem.completed === true) {
          resultArray.push(todoItem)
        }
      })
    })
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
    return resultArray
  }

  postTodo = (inputTask) => {
    const data = {}
    data.title = inputTask
    data.completed = false
    axios.post('/api/todos', data)
      .then(function (response) {
        console.log('Added: ' + data.title)
      })
      .catch(function (error) {
        console.log(error)
      })
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
}
