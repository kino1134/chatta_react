import React, { Component } from 'react'

class TopMessage extends Component {

  render () {
    if (!this.props.message) return null

    const color = this.props.color || 'info'
    return (
      <article className={'message is-' + color}>
        <div className="message-body">
          {this.props.message}
        </div>
      </article>
    )
  }
}

export default TopMessage
