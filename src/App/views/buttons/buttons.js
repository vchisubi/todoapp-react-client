import React from 'react'

export default function ButtonComponents (props) {
  return (
    <div className='button-container'>
      <button className='view-button' onClick={props.handleShowAll}>All Tasks</button>
      <button className='view-button' onClick={props.handleShowActive}>Active Tasks</button>
      <button className='view-button' onClick={props.handleShowComplete}>Completed Tasks</button>
      <button className='view-button' onClick={props.handleClearAll}>Clear</button>
    </div>
  )
}
