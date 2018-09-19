import React, { Component, Fragment } from 'react'

class InputMessage extends Component {

  render () {
    const errors = this.props.errors ||  []
    const color = this.props.color || 'info'

    const messages = errors.filter(e => e.param === this.props.name).map((err, i) => (
      <p key={i} className={'help is-' + color}>
        {err.msg}
      </p>
    ))
    if (messages.length === 0) return null

    return (<Fragment>{messages}</Fragment>)
  }
}

export default InputMessage
