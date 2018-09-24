import React, { Component } from 'react'
import Modal from 'react-modal'
import './index.css'

import apiHandler from '../../helpers/apiHandler'

import api from '../../services/api'
import socket from '../../services/socket'

Modal.setAppElement('#root')
const fileUploadStyles = {
  content: {
    minWidth: '70%',
    maxWidth: 'calc(100% - 32px)',
    maxHeight: '640px',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  }
}

class RoomPost extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.typing = false
    this.lastTypingTime = null
    this.fileInput = React.createRef()

    this.state = {
      focusTextarea: false,
      text: "",
      selectFile: "",
      uploadText: "",
      uploading: false,
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

  selectFile (e) {
    this.fileInput.current.click()
    this.setState({ uploadText: this.state.text })
  }

  clearSelectFile (e) {
    if (this.state.uploading) return
    this.setState({ selectFile: '' })
  }

  fileUpload (e) {
    if (this.state.uploading) return

    this.setState({ uploading: true })
    const body = new FormData()
    body.append('attachFile', this.fileInput.current.files[0])
    body.append('content', this.state.uploadText)
    api.postData({ url: '/api/messages/upload', body }).catch(err => { console.log(err) })
      .then(() => this.setState({ text: '', selectFile: '', uploading: false }) )
  }

  uploadEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.fileUpload(e)
    }
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
          </p>
          <p className="control main">
            <textarea name="text" className="textarea" placeholder="メッセージ" autoFocus
              rows={this.rows(this.state.text)} value={this.state.text} onChange={this.changeHandler}
              onInput={(e) => this.updateTyping(e)} onKeyDown={(e) => this.postEnter(e)}
              onFocus={e => this.switchFocusTextarea(e, true)} onBlur={e => this.switchFocusTextarea(e, false)}>
            </textarea>
          </p>
          <p className="control">
            <button className={`button is-success ${this.props.executing ? 'is-loading' : ''}`}
              onClick={(e) => this.posting(e)} disabled={this.noInput(this.state.text)}>
              <i className="fas fa-comment-dots fa-lg"></i>
            </button>
          </p>
        </div>
        <Modal contentLabel="ファイルアップロード" style={fileUploadStyles}
          isOpen={!!this.state.selectFile} onRequestClose={e => this.clearSelectFile(e) }>
          <div className="content delete-message-confirm">
            <h3 className="header">
              ファイルアップロード
              <a onClick={e => this.clearSelectFile(e) }><i className="fas fa-times"></i></a>
            </h3>
            <p>このファイルをアップロードしますか？</p>
            <div className="content message-container">
              {this.state.selectFile.replace('C:\\fakepath\\', '')}
            </div>
            <div className="field">
              <textarea name="uploadText" className="textarea" placeholder="メッセージの追加" autoFocus
                rows={this.rows(this.state.uploadText)} value={this.state.uploadText} onChange={this.changeHandler}
                onInput={(e) => this.updateTyping(e)} onKeyDown={(e) => this.uploadEnter(e)}>
              </textarea>
            </div>
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <a className="button" onClick={e => this.clearSelectFile(e) }>キャンセル</a>
                </div>
                <div className="level-item">
                  <a className={`button is-success ${this.state.uploading ? 'is-loading' : ''}`}
                    onClick={e => this.fileUpload(e)}>
                    アップロード
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </Modal>
      </footer>
    )
  }
}

export default apiHandler(RoomPost)
