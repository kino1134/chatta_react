import React, { Component } from 'react'
import './index.css'

import RoomPostTextarea from '../RoomPostTextarea'
import EmojiPicker from '../EmojiPicker'
import RoomPostUploadModal from '../RoomPostUploadModal'

import apiHandler from '../../helpers/apiHandler'

import api from '../../services/api'
import socket from '../../services/socket'

class RoomPost extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)
    this.clearSelectFile = this.clearSelectFile.bind(this)
    this.posting = this.posting.bind(this)
    this.focusTextarea = this.focusTextarea.bind(this)
    this.blurTextarea = this.blurTextarea.bind(this)

    this.typing = false
    this.lastTypingTime = null
    this.fileInput = React.createRef()

    this.state = {
      focusTextarea: false,
      emojiPickerPosition: null,
      text: "",
      selectFile: "",
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

  showTyping () {
    if (!this.state.typeUser) return null
    return (
      <div className="typing">
        <small>{this.state.typeUser}さんが入力しています..</small>
      </div>
    )
  }

  noInput (text) {
    return !/\S/.test(text)
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

  hasFocusTextarea () {
    return this.state.focusTextarea ? 'has-focus': ''
  }
  focusTextarea (e) {
    this.setState({ focusTextarea: true })
  }
  blurTextarea (e) {
    this.setState({ focusTextarea: false })
  }

  selectFile (e) {
    this.fileInput.current.click()
  }

  clearSelectFile (e, isAll) {
    if (isAll) {
      this.setState({ selectFile: '', text: '' })
    } else {
      this.setState({ selectFile: '' })
    }
  }

  showEmojiPicker (e) {
    const main = document.getElementById('main')
    const position = {
      bottom: main.clientWidth - e.clientX - 23,
      right: main.clientHeight - e.clientY
    }
    this.setState({ emojiPickerPosition: position })
  }

  render () {
    return (
      <footer id="room-post">
        {this.showTyping()}
        <div className={`field has-addons ${this.hasFocusTextarea()}`}>
          <p className="control">
            <input name="selectFile" type="file" className="file-input" ref={this.fileInput}
              value={this.state.selectFile} onChange={this.changeHandler}></input>
            <button className="button" onClick={e => this.selectFile(e)}>
              <i className="fas fa-plus"></i>
            </button>
            <RoomPostUploadModal uploadText={this.state.text} fileInput={this.fileInput} selectFile={this.state.selectFile}
              loginUser={this.props.loginUser} clearSelectFile={this.clearSelectFile}
            />
          </p>
          <p className="control main">
            <RoomPostTextarea name="text" placeholder="メッセージ" text={this.state.text} loginUser={this.props.loginUser}
              onChange={this.changeHandler} onEnter={this.posting} onFocus={this.focusTextarea} onBlur={this.blurTextarea}
            />
          </p>
          <p className="control">
            <button className={`button`} onClick={e => this.showEmojiPicker(e) }>
              <i className="far fa-smile fa-lg"></i>
            </button>
            <EmojiPicker position={this.state.emojiPickerPosition}
              onRequestClose={e => this.setState({ emojiPickerPosition: null }) }
              selectEmoji={k => this.setState({ text: `${this.state.text} ${k} ` }) }
            />
          </p>
          <p className="control">
            <button className={`button is-success ${this.props.executing ? 'is-loading' : ''}`}
              onClick={(e) => this.posting(e)} disabled={this.noInput(this.state.text)}>
              <i className="fas fa-comment-dots fa-lg"></i>
            </button>
          </p>
        </div>
      </footer>
    )
  }
}

export default apiHandler(RoomPost)
