import React from 'react'
import axios from 'axios'

export default class Controllers extends React.Component {
  updateAndSort = async () => {
    let ownerid = ''

    await axios.get('auth/authCheckUser').then((res) => {
      ownerid = res.data._id
    })

    if (ownerid === '' || ownerid === null || ownerid === undefined) {
      alert('No user is logged in!')
      console.log('No user is logged in!')
    } else {
      const resultArray = await fetch('/api/todos/' + ownerid).then(res =>
        res.json()
      )
      const sortedArray = resultArray.sort((a, b) => {
        return a._id - b._id
      })
      return sortedArray
    }
  }

  postTodo = (inputTask) => {
    // Used to get the id (ownerid) of the current user to make tasks user specific
    axios.get('auth/authCheckUser').then((res) => {
      const data = {
        title: inputTask,
        ownerid: res.data._id,
        completed: false
      }
      axios.post('/api/todos', data)
        .then((res) => {
          console.log('Added task: ' + data.title)
        })
    })
  }

  obliterateTask = (id) => {
    axios.delete('api/todos/' + id).then((res) => {
      console.log('Deleting: ' + id)
    })
      .catch(function (error) {
        console.log(error)
      }).then(
        this.updateAndSort())
  }

  obliterateAll = async () => {
    let ownerid = ''
    await axios.get('auth/authCheckUser').then((res) => {
      ownerid = res.data._id
    })
    axios.delete('api/todos/clear/' + ownerid).then((res) => {
      console.log(res.data)
    })
      .catch(function (error) {
        console.log(error)
      })
  }

  patchTask = (id, toggle) => {
    const data = {}
    data.id = id
    data.completed = toggle
    axios.patch('api/todos/' + id, data).then(function (response) {
    })
      .catch(function (error) {
        console.log(error)
      }).then(
        this.updateAndSort())
  }
}
