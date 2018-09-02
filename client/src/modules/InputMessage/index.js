import React, { Component } from 'react'

class InputMessage extends Component {

  render () {
    const errors = this.props.errors ||  []
    const messages = errors.filter(e => e.param === this.props.name).map(e => e.msg)
    if (!messages) return null

    const color = this.props.color || 'info'
    return (
      <div>{messages.map((msg, i) =>
        <p key={i} className={'help is-' + color}>
          {msg}
        </p>)
      }</div>
    )
  }
}

export default InputMessage
