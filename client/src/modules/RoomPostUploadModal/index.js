import React, { Component } from 'react'
import Modal from 'react-modal'

import withFocus from '../../helpers/withFocus'

import RoomPostTextarea from '../RoomPostTextarea'
import EmojiPicker from '../EmojiPicker'

import api from '../../services/api'

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

class RoomPostUploadModal extends Component {
  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)
    this.fileUpload = this.fileUpload.bind(this)

    this.state = {
      emojiPickerPosition: null,
      uploading: false,
      uploadText: ''
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  fileUpload (e) {
    if (this.state.uploading) return

    this.setState({ uploading: true })
    const body = new FormData()
    body.append('attachFile', this.props.fileInput.current.files[0])
    body.append('content', this.state.uploadText)
    api.postData({ url: '/api/messages/upload', body }).catch(err => { console.log(err) })
      .then(() => {
        this.props.clearSelectFile(e, true)
        this.setState({ uploading: false })
      })
  }

  uploadEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.fileUpload(e)
    }
  }

  showEmojiPicker (e) {
    const main = document.getElementById('main')
    const position = {
      bottom: Math.min(main.clientHeight - e.clientY - 23, 320),
      right: main.clientWidth - e.clientX
    }
    this.setState({ emojiPickerPosition: position })
  }

  render () {
    if (!this.props.selectFile) return null

    return (
      <Modal contentLabel="ファイルアップロード" style={fileUploadStyles} isOpen={!!this.props.selectFile}
        onAfterOpen={e => this.setState({ uploadText: this.props.uploadText })}
        onRequestClose={e => this.props.clearSelectFile(e) }>
        <div className="content delete-message-confirm">
          <h3 className="header">
            ファイルアップロード
            <a onClick={e => this.props.clearSelectFile(e) }><i className="fas fa-times"></i></a>
          </h3>
          <p>このファイルをアップロードしますか？</p>
          <div className="content message-container">
            {this.props.selectFile.replace('C:\\fakepath\\', '')}
          </div>
          <div className={`room-post-area field has-addons ${this.props.getFocusClass()}`}>
            <div className="control main">
              <RoomPostTextarea name="uploadText" placeholder="メッセージの追加" text={this.state.uploadText}
                loginUser={this.props.loginUser} onChange={this.changeHandler} onEnter={this.fileUpload}
                onFocus={this.props.setFocus} onBlur={this.props.setBlur}
              />
            </div>
            <p className="control">
              <button className={`button`} onClick={e => this.showEmojiPicker(e) }>
                <i className="far fa-smile fa-lg"></i>
              </button>
              <EmojiPicker position={this.state.emojiPickerPosition}
                onRequestClose={e => this.setState({ emojiPickerPosition: null }) }
                selectEmoji={k => this.setState({ uploadText: `${this.state.uploadText} ${k} ` }) }
              />
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <a className="button" onClick={e => this.props.clearSelectFile(e, false) }>キャンセル</a>
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
    )
  }
}

export default withFocus({ stateName: 'focusTextArea', className: 'has-focus' })(RoomPostUploadModal)
