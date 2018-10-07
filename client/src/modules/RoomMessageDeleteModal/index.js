import React, { Component } from 'react'
import Modal from 'react-modal'
import moment from 'moment'
import 'moment/locale/ja'
import markdownIt from 'markdown-it'
import markdownItEmoji from 'markdown-it-emoji'
import './index.css'

Modal.setAppElement('#root')
const deleteConfirmStyles = {
  content: {
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

class RoomMessageDeleteModal extends Component {
  markdown (content) {
    return markdownIt({ breaks: true, linkify: true }).use(markdownItEmoji).render(content)
  }

  showDeleteMessage (message) {
    if (!message) return null
    return (
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p className="message-info">
              <strong>{message.user.displayName}</strong>
              <small> | </small>
              <small>{moment(message.createdAt).format('llll')}</small>
            </p>
            <p>
              <span className="message-content"
                dangerouslySetInnerHTML={{ __html: this.markdown(message.content) }}>
              </span>
            </p>
          </div>
        </div>
      </article>
    )
  }

  render () {
    if (!this.props.deleteMessage) return null

    return (
      <Modal contentLabel="メッセージの削除" style={deleteConfirmStyles}
        isOpen={!!this.props.deleteMessage} onRequestClose={e => this.props.onCancelDeleteMessage(e) }>
        <div className="content delete-message-confirm">
          <h3 className="header">
            メッセージの削除
            <a onClick={e => this.props.onCancelDeleteMessage(e) }><i className="fas fa-times"></i></a>
          </h3>
          <p>このメッセージを削除しますか？この操作は元に戻すことができません</p>
          <div className="content message-container">
            {this.showDeleteMessage(this.props.deleteMessage)}
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
            </div>
            <div className="level-right">
              <div className="level-item">
                <a className="button" onClick={e => this.props.onCancelDeleteMessage(e) }>キャンセル</a>
              </div>
              <div className="level-item">
                <a className={`button is-danger ${this.props.editing ? 'is-loading': ''}`}
                  onClick={e => this.props.onDeleteMessage(e)}>削除</a>
              </div>
            </div>
          </nav>
        </div>
      </Modal>
    )
  }
}

export default RoomMessageDeleteModal
