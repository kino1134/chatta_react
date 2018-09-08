import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/ja'
import marked from 'marked'
import './index.css'

import socket from '../../services/socket'
import api from '../../services/api'

class RoomMessageList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      list: [],
      loading: true
    }
  }

  scrollLast () {
    const container = document.querySelector('#room-message-list')
    container.scrollTop = container.scrollHeight
  }

  componentDidMount () {
    // TODO: 全件取得しているので、スクロールに応じて追加取得できるようにしたい
    // TODO: Storeに持ったほうがいいかな？
    api.get('/api/messages/all').then(res => {
      res.json().then(json => {
        if (res.ok) {
          this.setState({
            list: json.messages,
            loading: false
          })
        } else {
          // TODO: エラー処理
        }
      })
    }).then(this.scrollLast).then(() => {
      // TODO: ソケットのイベントリスナーを置く場所は、ここじゃない方がいいかも
      socket.on('postMessage', data => {
        this.setState({ list: [...this.state.list, data] })
      })
    }).catch(err => { console.log(err) })
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
    // TODO: ローディング
    let result = 'しばらくお待ち下さい..'
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
