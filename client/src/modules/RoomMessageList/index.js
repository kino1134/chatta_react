import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import 'moment/locale/ja'
import Push from 'push.js'
import './index.css'

import RoomLoading from '../RoomLoading'
import RoomMessage from '../RoomMessage'
import RoomMessageMenu from '../RoomMessageMenu'
import RoomMessageEdit from '../RoomMessageEdit'
import RoomMessageDeleteModal from '../RoomMessageDeleteModal'

import socket from '../../services/socket'
import api from '../../services/api'

// プロフィール変更画面から戻ってきたときにも位置を復元したい
// TODO: 場所がかなり汚い・・
let roomMessagePosition = [{ height: 0, position: 0 }]

class RoomMessageList extends Component {

  constructor (props) {
    super(props)

    this.reading = false

    this.clickAction = this.clickAction.bind(this)
    this.cancelDeleteMessage = this.cancelDeleteMessage.bind(this)
    this.deleteMessage = this.deleteMessage.bind(this)
    this.cancelSelectMessage = this.cancelSelectMessage.bind(this)
    this.selectEditMessage = this.selectEditMessage.bind(this)
    this.selectDeleteMessage = this.selectDeleteMessage.bind(this)
    this.cancelEditMessage = this.cancelEditMessage.bind(this)
    this.editMessage = this.editMessage.bind(this)

    this.state = {
      menuPosition: null,
      selectMessage: null,
      editMessage: null,
      deleteMessage: null,
      editing: false,
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

  // TODO: 既読判定の方法はもう少し真面目に整理したほうがいい
  readAllMessage(e, container) {
    // 当アプリが表示されていない場合、既読更新を行わない
    if (document.hidden) return

    // すでに既読状態を更新中なら、再実行はしない
    if (this.reading) return

    // 最新メッセージと既読状態が同じ場合、既読更新を行わない
    const lastMessage = this.props.message.list[this.props.message.list.length - 1]
    if (this.props.loginUser.readMessage === lastMessage.id) return

    const unread = document.querySelector('.unread-line')
    const threshold = container.clientHeight / 2
    // 既読メッセージがない、既読はあるがメッセージそのものがなくなっている、未読の線を下の方までスクロールした時に既読更新を行う
    if (!this.props.loginUser.readMessage || !unread || (unread.offsetTop >= container.scrollTop + threshold)) {
      this.reading = true
      // 未読表示を消すまで、少し猶予を与える
      setTimeout(() => {
        api.putJson('/api/users/read', { messageId: lastMessage.id }).then(res =>{
          // TODO: 消さない方がいいかも
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
      // TODO: [this] がメモリリークしてるみたい
      // メッセージの読込が完了した時点でイベント受信を開始する
      socket.on('postMessage', data => {
        this.props.addMessage(data)
        // this.setState({ event: 'posted' })
        if (document.hidden) {
          // チャット欄が隠れている場合、通知を行う
          Push.create(data.user.displayName, {
            body: data.content,
            icon: data.user.photo,
            timeout: 5000
          })
        }
      })
      socket.on('updateMessage', data => {
        this.props.editMessage(data)
      })
      socket.on('removeMessage', data => {
        this.props.removeMessage(data)
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

    // 後続メッセージが追加されている場合、再度イベントの発行を行う
    // ソケットイベントの中でstateの変更を行うと、thisがいなくなっている場合がある
    if (prevProps.message.previous === this.props.message.previous &&
      prevProps.message.list && this.props.message.list.length > prevProps.message.list.length) {
      this.setState({ event: 'posted' })
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

  // メッセージメニューのハンドラ群
  clickAction (e, message) {
    const position = {
      top: e.clientY - 50,
      left: e.clientX - 200
    }
    this.setState({ selectMessage: message, menuPosition: position })
  }
  cancelSelectMessage (e) {
    this.setState({ selectMessage: null })
  }
  selectEditMessage (e) {
    this.setState({ selectMessage: null, editMessage: this.state.selectMessage })
  }
  selectDeleteMessage (e) {
    this.setState({ deleteMessage: this.state.selectMessage, selectMessage: null })
  }

  // メッセージ編集のハンドラ群
  cancelEditMessage (e) {
    this.setState({ editMessage: null })
  }
  editMessage (e, text) {
    if (this.state.editing) return
    this.setState({ editing: true })

    // メッセージが全て消されている場合、削除に移行する
    const promise = text ?
      api.put('/api/messages/' + this.state.editMessage.id, { content: text }) :
      api.delete('/api/messages/' + this.state.editMessage.id)

    promise.then(res => {
      // 何もしない
    }).catch(err => console.log(err) )
      .then(() => {
        this.setState({ editing: false })
        this.setState({ editMessage: null })
      })
  }

  // メッセージ削除のハンドラ群
  cancelDeleteMessage (e) {
    this.setState({ deleteMessage: null })
  }
  deleteMessage (e) {
    if (this.state.editing) return
    this.setState({ editing: true })

    api.delete('/api/messages/' + this.state.deleteMessage.id).then(res => {
      // 何もしない
    }).catch(err => console.log(err) )
      .then(() => this.setState({ editing: false, deleteMessage: null }) )
  }

  // レンダリングを行うメソッド群
  showListHead () {
    if (this.props.message.previous || this.state.loading) {
      return (
        <RoomLoading />
      )
    } else {
      return (
        <article key="Hello" className="hello">会話を開始しました</article>
      )
    }
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
    if (this.state.editMessage && message.id === this.state.editMessage.id) {
      return (
        <RoomMessageEdit key={this.state.editMessage.id} editMessage={this.state.editMessage} editing={this.state.editing}
          onCancelEditMessage={this.cancelEditMessage} onEditMessage={this.editMessage} loginUser={this.props.loginUser} />
      )
    }

    return (
      <RoomMessage key={message.id} message={message} onShowMenu={this.clickAction} />
    )
  }

  render () {
    return (
      <div id="room-message-list" onScroll={e => this.scrollUp(e)}>
        {this.showListHead()}
        {this.showMessageList()}
        <RoomMessageMenu selectMessage={this.state.selectMessage} loginUser={this.props.loginUser}
          position={this.state.menuPosition} onCancelSelectMessage={this.cancelSelectMessage}
          onSelectEditMessage={this.selectEditMessage} onSelectDeleteMessage={this.selectDeleteMessage}
        />
        <RoomMessageDeleteModal deleteMessage={this.state.deleteMessage} editing={this.state.editing}
          onDeleteMessage={this.deleteMessage} onCancelDeleteMessage={this.cancelDeleteMessage}
        />
      </div>
    )
  }
}

export default RoomMessageList
