import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import 'moment/locale/ja'
import marked from 'marked'
import './index.css'

import RoomLoading from '../RoomLoading'

import socket from '../../services/socket'
import api from '../../services/api'

class RoomMessageList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      list: [],
      loading: true
    }

  selfDOM () {
    return ReactDOM.findDOMNode(this)
  }

  scrollLast () {
    const container = this.selfDOM()
    container.scrollTop = container.scrollHeight
  }

  componentDidMount () {
    // TODO: 全件取得しているので、スクロールに応じて追加取得できるようにしたい
    // TODO: Storeに持ったほうがいいかな？
    api.getJson('/api/messages/all').then(res => {
      if (res.ok) {
        this.setState({ list: res.data.messages })
      } else {
        console.log(res.data)
      }

      this.scrollLast()
      // TODO: ソケットのイベントリスナーを置く場所は、ここじゃない方がいいかも
      socket.on('postMessage', data => {
        this.setState({ list: [...this.state.list, data] })
      })
    }).catch(err => { console.log(err) })
      .then(() => this.setState({ loading: false }))
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // TODO: 強制的に下に行くのは不親切かも
    // TODO: 現在のスクロール位置に応じて判断したい
    this.scrollLast()
  }

  markdown (content) {
    return marked(content, {
      sanitize: true,
      gfm: true,
      breaks: true
      // TODO: コードハイライト
      // highlight: function (code, lang) {
      //   return lang ? highlight.highlight(lang, code).value : highlight.highlightAuto(code).value
      // }
    })
  }

  showMessage (message) {
    return (
      <article key={message.id} className="media">
        <figure className="media-left">
          <p className="image avator">
            <img src={message.user.photo} alt={message.user.displayName} />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <span className="message-info">
                <strong>{message.user.displayName}</strong>
                <small>@{message.user.userId}</small>
                <small> | </small>
                <small>{moment(message.createdAt).format('llll')}</small>
              </span>
              <br/>
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
    let result = (<RoomLoading />)
    if (!this.state.loading) {
      result = this.state.list.map(m => this.showMessage(m))
    }

    return (
      <div id="room-message-list">
        {result}
      </div>
    )
  }
}

export default RoomMessageList
