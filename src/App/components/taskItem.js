import React from 'react'

export default function TodoItem (props) {
  const completedStyle = {
    fontStyle: 'italic',
    color: '#cdcdcd',
    textDecoration: 'line-through'
  }

  return (
    <div className='todo-item'>
      <input
        type='checkbox'
        onChange={() => props.handleChange(props.item.id)}
        checked={props.item.completed}
      />
      <label style={props.item.completed ? completedStyle : null}>{props.item.title}</label>
      <span
        className='obliterate'
        onClick={() => props.handleClick(props.item.id)}
      > {'\u00D7'}
      </span>
    </div>
  )
}
