import React, { Component } from 'react'
import './index.css'

import socket from '../../services/socket'

class RoomPostTextarea extends Component {
  constructor (props) {
    super(props)

    this.typing = false
    this.lastTypingTime = null
  }

  updateTyping (e) {
    const tick = 400
    this.lastTypingTime = (new Date()).getTime()

    if (!this.typing) {
      this.typing = true
      socket.emit('typing', this.props.loginUser.displayName)
    }

    setTimeout(() => {
      const time = (new Date()).getTime()
      const diff = time - this.lastTypingTime
      if (diff >= tick && this.typing) {
        socket.emit('stop_typing', this.props.loginUser.displayName)
        this.typing = false
      }
    }, tick)
  }

  rows (text) {
    const num = text.split('\n').length
    if (num < 1) {
      return 1
    } else if (num >= 5) {
      return 5
    } else {
      return num
    }
  }

  postEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.props.onEnter(e)
    }
  }

  render () {
    return (
      <textarea name={this.props.name} id={this.props.id} className="textarea" placeholder={this.props.placeholder} autoFocus
        rows={this.rows(this.props.text)} value={this.props.text} onChange={this.props.onChange}
        onInput={(e) => this.updateTyping(e)} onKeyDown={(e) => this.postEnter(e)}
        onFocus={this.props.onFocus} onBlur={this.props.onBlur}>
      </textarea>
    )
  }
}

export default RoomPostTextarea
