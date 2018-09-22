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

    this.scroll = [{ height: 0, position: 0 }]

    this.state = {
      list: [],
      previous: null,
      loading: true,
      event: null
    }
  }

  selfDOM () {
    return ReactDOM.findDOMNode(this)
  }

  scrollUp (e) {
    // スクロール時点の位置情報を保持する
    const container = this.selfDOM()
    this.scroll[0] = { height: container.scrollHeight, position: container.scrollTop }

    // 最後まで読込済み、またはローディング中の場合はAPIを呼び出さない
    if (!this.state.previous) return
    if (this.state.loading) return

    const threshold = 60
    if (threshold >= container.scrollTop) {
      this.setState({ loading: true })
      api.getJson('/api/messages?last=' + this.state.previous).then(res => {
        if (res.ok) {
          this.setState({
            list: [...res.data.messages, ...this.state.list],
            previous: res.data.previous
          })
        } else {
          console.log(res.data)
        }
      }).catch(err => { console.log(err) })
        .then(() => this.setState({ loading: false, event: 'scroll' }) )
    }
  }

  componentDidMount () {
    // TODO: Storeに持ったほうがいいかな？
    api.getJson('/api/messages').then(res => {
      if (res.ok) {
        this.setState({ list: res.data.messages, previous: res.data.previous })
      } else {
        console.log(res.data)
      }

      // TODO: ソケットのイベントリスナーを置く場所は、ここじゃない方がいいかも
      // メッセージの読込が完了した時点でイベント受信を開始する
      socket.on('postMessage', data => {
        this.setState({ list: [...this.state.list, data], event: 'posted' })
      })
    }).catch(err => { console.log(err) })
      .then(() => this.setState({ loading: false, event: 'init' }))
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const container = this.selfDOM()

    // DOMがアップデートされた時点の位置情報を保持する
    this.scroll[1] = { height: container.scrollHeight, position: container.scrollTop }

    // 最後まで読み込んでローディングパネルがなくなった時
    // スクロール位置がずれるので、それを補正する
    if (prevState.loading && !this.state.loading) {
      container.scrollTop  = this.scroll[0].position
    }

    // イベント名が設定されている場合のみ、スクロール位置を動かす
    if (this.state.event) this.moveScroll(container)
  }

  moveScroll (container) {
    if (this.state.event === 'scroll') {
      container.scrollTop = container.scrollTop + (this.scroll[1].height - this.scroll[0].height)
    } else if(this.state.event === 'init') {
      container.scrollTop = container.scrollHeight
    } else if (this.state.event === 'posted') {
      // TODO: 強制的に下に行くのは不親切かも
      // TODO: 現在のスクロール位置に応じて判断したい
      container.scrollTop = container.scrollHeight
    }

    // スクロールを動かした後の状態を保持する
    this.scroll = [{ height: container.scrollHeight, position: container.scrollTop }]
    this.setState({ event: null })
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
    let head = null
    if (this.state.previous || this.state.loading) {
      head = (<RoomLoading />)
    }

    return (
      <div id="room-message-list" onScroll={e => this.scrollUp(e)}>
        {head}
        {this.state.list.map(m => this.showMessage(m))}
      </div>
    )
  }
}

export default RoomMessageList
