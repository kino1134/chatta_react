import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/ja'
import markdownIt from 'markdown-it'
import markdownItEmoji from 'markdown-it-emoji'

class RoomMessage extends Component {
  markdown (content) {
    return markdownIt({ breaks: true, linkify: true }).use(markdownItEmoji).render(content)
  }

  render () {
    const { message } = this.props

    let fileLink = null
    if (message.file && message.file.name) {
      fileLink = (
        <span>
          添付ファイル：<a onClick={e => this.downloadFile(e, message.id, message.file.name)}>{message.file.name}</a>
        </span>
      )
    }

    return (
      <article className="media">
        <figure className="media-left">
          <p className="image avator">
            <img src={message.user.photo} alt={message.user.displayName} />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p className="message-info">
              <strong>{message.user.displayName}</strong>
              <small>@{message.user.userId}</small>
              <small> | </small>
              <small>{moment(message.createdAt).format('llll')}</small>
            </p>
            <p>
              <span className="message-content"
                dangerouslySetInnerHTML={{ __html: this.markdown(message.content) }}>
              </span>
              {fileLink}
            </p>
          </div>
        </div>
        <nav className="level is-mobile message-action">
          <a className="icon is-medium" onClick={e => this.props.onShowMenu(e, message)}>
            <i className="far fa-caret-square-down fa-lg"></i>
          </a>
        </nav>
      </article>
    )
  }
}

export default RoomMessage
