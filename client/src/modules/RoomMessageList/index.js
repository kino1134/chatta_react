import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import 'moment/locale/ja'
import marked from 'marked'
import Push from 'push.js'
import './index.css'

import RoomLoading from '../RoomLoading'

import socket from '../../services/socket'
import api from '../../services/api'

// プロフィール変更画面から戻ってきたときにも位置を復元したい
// TODO: 場所がかなり汚い・・
let roomMessagePosition = [{ height: 0, position: 0 }]

class RoomMessageList extends Component {

  constructor (props) {
    super(props)

    this.reading = false

    this.state = {
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
    roomMessagePosition[0] = { height: container.scrollHeight, position: container.scrollTop }

    // 既読判定を行う
    this.readAllMessage(e, container)

    // 最後まで読込済み、またはローディング中の場合はAPIを呼び出さない
    if (!this.props.message.previous) return
    if (this.state.loading) return

    const threshold = 60
    if (threshold >= container.scrollTop) {
      this.setState({ loading: true })
      api.getJson('/api/messages?last=' + this.props.message.previous).then(res => {
        if (res.ok) {
          this.props.joinMessage({
            list: res.data.messages,
            previous: res.data.previous
          })
        } else {
          console.log(res.data)
        }
      }).catch(err => { console.log(err) })
        .then(() => this.setState({ loading: false, event: 'scroll' }) )
    }
  }

  readAllMessage(e, container) {
    const lastMessage = this.props.message.list[this.props.message.list.length - 1]
    if (this.props.loginUser.readMessage === lastMessage.id) return

    const unread = document.querySelector('.unread-line')
    const threshold = container.clientHeight / 2
    if (!this.props.loginUser.readMessage ||
      (!document.hidden && !this.reading && unread.offsetTop >= container.scrollTop + threshold)) {
      this.reading = true
      // 未読表示を消すまで、少し猶予を与える
      setTimeout(() => {
        api.putJson('/api/users/read', { messageId: lastMessage.id }).then(res =>{
          if (res.ok) {
            this.props.updateLoginUser({ readMessage: res.data.id })
          } else {
            console.log(res.data)
          }
        }).catch(err => { console.log(err) })
          .then(() => this.reading = false )
      }, 1000)
    }
  }

  componentDidMount () {
    if (this.props.message.list) {
      this.setState({ loading: false })
      this.selfDOM().scrollTop = roomMessagePosition[0].position
      return
    }

    api.getJson('/api/messages').then(res => {
      if (res.ok) {
        this.props.setMessage({ list: res.data.messages, previous: res.data.previous })
      } else {
        console.log(res.data)
      }

      // TODO: ソケットのイベントリスナーを置く場所は、ここじゃない方がいいかも
      // メッセージの読込が完了した時点でイベント受信を開始する
      socket.on('postMessage', data => {
        this.props.addMessage(data)
        this.setState({ event: 'posted' })
        if (document.hidden) {
          // チャット欄が隠れている場合、通知を行う
          Push.create(data.user.displayName, {
            body: data.content,
            icon: data.user.photo,
            timeout: 5000
          })
        }
      })
    }).catch(err => { console.log(err) })
      .then(() => this.setState({ loading: false, event: 'init' }))
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const container = this.selfDOM()

    // DOMがアップデートされた時点の位置情報を保持する
    roomMessagePosition[1] = { height: container.scrollHeight, position: container.scrollTop }

    // 最後まで読み込んでローディングパネルがなくなった時
    // スクロール位置がずれるので、それを補正する
    if (prevState.loading && !this.state.loading) {
      container.scrollTop  = roomMessagePosition[0].position
    }

    // イベント名が設定されている場合のみ、スクロール位置を動かす
    if (this.state.event) this.moveScroll(container)
  }

  moveScroll (container) {
    if (this.state.event === 'scroll') {
      container.scrollTop = container.scrollTop + (roomMessagePosition[1].height - roomMessagePosition[0].height)
    } else if(this.state.event === 'init') {
      container.scrollTop = container.scrollHeight
    } else if (this.state.event === 'posted') {
      // TODO: 強制的に下に行くのは不親切かも
      // TODO: 現在のスクロール位置に応じて判断したい
      container.scrollTop = container.scrollHeight
    }

    // スクロールを動かした後の状態を保持する
    roomMessagePosition = [{ height: container.scrollHeight, position: container.scrollTop }]
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

  showMessageList () {
    const result = []

    if (this.props.message.list === null) return result
    this.props.message.list.forEach((m, i, arr) => {
      if (i === 0 || !moment(m.createdAt).isSame(arr[i - 1].createdAt, 'day')) {
        result.push(this.showDateLine(m))
      }

      result.push(this.showMessage(m))

      if (i !== this.props.message.list.length - 1 && this.props.loginUser.readMessage === m.id) {
        result.push(this.showUnreadLine(this.props.loginUser.readMessage))
      }
    })

    return result
  }

  showHelloMessage () {
    return (
      <article key="Hello" className="hello">
        会話を開始しました
      </article>
    )
  }

  showUnreadLine(messageId) {
    return (
      <div key={`read-${messageId}`} className="unread-line">
        <hr />
        <span className="content">未読</span>
      </div>
    )
  }

  showDateLine (message) {
    const date = moment(message.createdAt)
    return (
      <div key={date.format('YYYYMMDD')} className="date-line">
        <hr />
        <strong className="content">{date.format('MMMMDo(ddd)')}</strong>
      </div>
    )
  }

  showMessage(message) {
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
    if (this.props.message.previous || this.state.loading) {
      head = (<RoomLoading />)
    } else {
      head = this.showHelloMessage()
    }

    return (
      <div id="room-message-list" onScroll={e => this.scrollUp(e)}>
        {head}
        {this.showMessageList()}
      </div>
    )
  }
}

export default RoomMessageList
