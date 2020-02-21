import React from 'react'

export default function InputField2 (props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <input
        onChange={props.handleInput}
        type='text'
        value={props.data}
        name='userInput'
      />
      <br />
      <button className='submit-button'>Submit</button>
    </form>
  )
}
