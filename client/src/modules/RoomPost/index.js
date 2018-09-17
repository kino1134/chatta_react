import React, { Component } from 'react'
import './index.css'

import api from '../../services/api'
import socket from '../../services/socket'

class RoomPost extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.typing = false
    this.lastTypingTime = null

    this.state = {
      text: "",
      typeUser: ""
    }

    socket.on('typing', ({ displayName }) => {
      this.setState({ typeUser: displayName })
    })
    socket.on('stop_typing', ({ displayName }) => {
      this.setState({ typeUser: "" })
    })
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
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

  showTyping () {
    if (!this.state.typeUser) return null
    return (
      <div className="typing">
        <small>{this.state.typeUser}さんが入力しています..</small>
      </div>
    )
  }

  rows () {
    const num = this.state.text.split('\n').length
    if (num < 1) {
      return 1
    } else if (num >= 5) {
      return 5
    } else {
      return num
    }
  }

  noInput () {
    return !/\S/.test(this.state.text)
  }

  posting (e) {
    api.postJson('/api/messages', { content: this.state.text }).then(res => {
      console.log(res.data)
      if (res.ok) {
        this.setState({ text: "" })
      }
    }).catch(err => { console.log(err) })
  }

  postEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.posting(e)
    }
  }

  render () {
    return (
      <footer id="room-post">
        {this.showTyping()}
        <div className="field has-addons">
          <p className="control main">
            <textarea name="text" className="textarea" placeholder="メッセージ" autoFocus
              rows={this.rows()} value={this.state.text} onChange={this.changeHandler}
              onInput={(e) => this.updateTyping(e)} onKeyDown={(e) => this.postEnter(e)}>
            </textarea>
          </p>
          <p className="control">
            <button className="button is-success"
              onClick={(e) => this.posting(e)} disabled={this.noInput()}>
              <i className="fas fa-comment-dots fa-lg"></i>
            </button>
          </p>
        </div>
      </footer>
    )
  }
}

export default RoomPost
