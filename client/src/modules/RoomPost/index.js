import React, { Component } from 'react'
import './index.css'

import apiHandler from '../../helpers/apiHandler'

import api from '../../services/api'
import socket from '../../services/socket'

class RoomPost extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.typing = false
    this.lastTypingTime = null

    this.state = {
      focusTextarea: false,
      text: "",
      typeUser: ""
    }

    // TODO: ここじゃない？
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
    if (this.props.preventExecute()) return

    const lastMessage =  this.props.message.list[this.props.message.list.length - 1]
    api.postJson('/api/messages', { content: this.state.text }).then(res => {
      console.log(res.data)
      if (res.ok) {
        this.setState({ text: "" })
        // 最後まで既読している場合、状態を変更して表示されないようにする
        if (this.props.message.list && this.props.loginUser.readMessage === lastMessage.id) {
          // サーバ側については投げっぱなしにする
          api.putJson('/api/users/read', { messageId: res.data.id }).catch(err => { console.log(err) })
          this.props.updateLoginUser({ readMessage: res.data.id })
        }
      }
    }).catch(err => { console.log(err) })
      .then(() => this.props.endExecute() )
  }

  postEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.posting(e)
    }
  }

  hasFocusTextarea () {
    return this.state.focusTextarea ? 'has-focus': ''
  }
  switchFocusTextarea (e, value) {
    this.setState({ focusTextarea: value })
  }

  render () {
    return (
      <footer id="room-post">
        {this.showTyping()}
        <div className={`field has-addons ${this.hasFocusTextarea()}`}>
          <p className="control main">
            <textarea name="text" className="textarea" placeholder="メッセージ" autoFocus
              rows={this.rows()} value={this.state.text} onChange={this.changeHandler}
              onInput={(e) => this.updateTyping(e)} onKeyDown={(e) => this.postEnter(e)}
              onFocus={e => this.switchFocusTextarea(e, true)} onBlur={e => this.switchFocusTextarea(e, false)}>
            </textarea>
          </p>
          <p className="control">
            <button className={`button is-success ${this.props.executing ? 'is-loading' : ''}`}
              onClick={(e) => this.posting(e)} disabled={this.noInput()}>
              <i className="fas fa-comment-dots fa-lg"></i>
            </button>
          </p>
        </div>
      </footer>
    )
  }
}

export default apiHandler(RoomPost)
