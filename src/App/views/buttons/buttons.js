import React from 'react'

export default function ButtonComponents (props) {
  return (
    <div className='button-container'>
      <button className='view-button' onClick={props.handleShowAll}>Show All Tasks</button>
      <button className='view-button' onClick={props.handleShowActive}>Show Active Tasks</button>
      <button className='view-button' onClick={props.handleShowComplete}>Show Active Tasks</button>
      <button className='view-button' onClick={props.handleClearAll}>Clear All Tasks</button>
    </div>
  )
}
