import React, { PureComponent } from 'react'
import moment from 'moment'
import 'moment/locale/ja'

import Markdown from '../../components/Markdown'

import api from '../../services/api'

class RoomMessage extends PureComponent {
  downloadFile (e, id, name) {
    api.downloadFile('/api/messages/download/' + id, name)
      .catch(err => console.log(err))
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
              <Markdown className="message-content" content={message.content} />
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
