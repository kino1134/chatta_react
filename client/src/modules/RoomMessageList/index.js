import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import moment from 'moment'
import 'moment/locale/ja'
import marked from 'marked'
import Push from 'push.js'
import './index.css'

import RoomLoading from '../RoomLoading'

import socket from '../../services/socket'
import api from '../../services/api'

Modal.setAppElement('#root')
const customStyles = {
  content: {
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: '8px 0',
  },
  overlay: {
    backgroundColor: 'transparent'
  }
}
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

// プロフィール変更画面から戻ってきたときにも位置を復元したい
// TODO: 場所がかなり汚い・・
let roomMessagePosition = [{ height: 0, position: 0 }]

class RoomMessageList extends Component {

  constructor (props) {
    super(props)

    this.editing = false
    this.reading = false

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      selectMessage: null,
      editMessage: null,
      deleteMessage: null,
      inputText: null,
      loading: true,
      event: null
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  editEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.editMessage(e)
    }
  }

  rows () {
    const num = this.state.inputText.split('\n').length
    if (num < 1) {
      return 1
    } else if (num >= 5) {
      return 5
    } else {
      return num
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

  downloadFile (e, id, name) {
    api.downloadFile('/api/messages/download/' + id, name)
      .catch(err => console.log(err))
  }

  showMessage(message) {
    if (this.state.editMessage && message.id === this.state.editMessage.id) {
      return this.showEditMessageArea(message)
    }

    let fileLink = null
    if (message.file && message.file.name) {
      fileLink = (
        <span>
          添付ファイル：<a onClick={e => this.downloadFile(e, message.id, message.file.name)}>{message.file.name}</a>
        </span>
      )
    }

    return (
      <article key={message.id} className="media">
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
        <nav className="level message-action">
          <a className="icon is-medium" onClick={e => this.clickAction(e, message)}>
            <i className="far fa-caret-square-down fa-lg"></i>
          </a>
        </nav>
      </article>
    )
  }

  // TODO: 入力中表示ができてない
  showEditMessageArea (message) {
    return (
      <article key={message.id} className="media" style={{backgroundColor: '#fff5df'}}>
        <figure className="media-left">
          <p className="image avator">
            <img src={message.user.photo} alt={message.user.displayName} />
          </p>
        </figure>
        <div className="media-content">
          <div className="field">
            <div className="control">
              <textarea name="inputText" placeholder="メッセージを編集" className="textarea" autoFocus value={this.state.inputText}
                onChange={this.changeHandler} rows={this.rows()} onKeyDown={(e) => this.editEnter(e)} >
              </textarea>
            </div>
          </div>
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <a className="button" onClick={e => this.cancelEditMessage(e)}>キャンセル</a>
              </div>
              <div className="level-item">
                <a className="button is-success" onClick={e => this.editMessage(e)}>変更</a>
              </div>
            </div>
          </nav>
        </div>
      </article>
    )
  }

  clickAction (e, message) {
    this.setState({ selectMessage: message })
    customStyles.content.top = e.clientY - 50
    customStyles.content.left = e.clientX - 200
  }

  cancelSelectMessage (e) {
    this.setState({ selectMessage: null })
  }

  selectEditMessage (e) {
    this.setState({ selectMessage: null, editMessage: this.state.selectMessage, inputText: this.state.selectMessage.content })
  }

  cancelEditMessage (e) {
    this.setState({ editMessage: null, inputText: null })
  }

  editMessage (e) {
    if (this.editing) return
    this.editing = true

    // メッセージが全て消されている場合、削除に移行する
    const promise = this.state.inputText ?
      api.put('/api/messages/' + this.state.editMessage.id, { content: this.state.inputText }) :
      api.delete('/api/messages/' + this.state.editMessage.id)

    promise.then(res => {
      // 何もしない
    }).catch(err => console.log(err) )
      .then(() => {
        this.editing = false
        this.setState({ editMessage: null })
      })
  }


  selectDeleteMessage (e) {
    this.setState({ deleteMessage: this.state.selectMessage, selectMessage: null })
  }

  cancelDeleteMessage (e) {
    this.setState({ deleteMessage: null })
  }

  deleteMessage (e) {
    if (this.editing) return
    this.editing = true

    api.delete('/api/messages/' + this.state.deleteMessage.id).then(res => {
      // 何もしない
    }).catch(err => console.log(err) )
      .then(() => {
        this.editing = false
        this.setState({ deleteMessage: null })
      })
  }

  render () {
    let head = null
    if (this.props.message.previous || this.state.loading) {
      head = (<RoomLoading />)
    } else {
      head = this.showHelloMessage()
    }

    let editMessageMenu = null
    if (this.state.selectMessage && this.props.loginUser.userId === this.state.selectMessage.user.userId) {
      editMessageMenu = (
        <Fragment>
          <li><hr/></li>
          <li><a onClick={e => this.selectEditMessage(e) }>
            <i className="fas fa-edit" style={{marginRight: '5px'}}></i>メッセージの編集
          </a></li>
          <li><a onClick={e => this.selectDeleteMessage(e) } className="has-text-danger">
            <i className="fas fa-trash-alt" style={{marginRight: '5px'}}></i>削除
          </a></li>
        </Fragment>
      )
    }

    let deleteMessage = null
    if (this.state.deleteMessage) {
      deleteMessage = (
        <article className="media">
          <div className="media-content">
            <div className="content">
              <p className="message-info">
                <strong>{this.state.deleteMessage.user.displayName}</strong>
                <small> | </small>
                <small>{moment(this.state.deleteMessage.createdAt).format('llll')}</small>
              </p>
              <p>
                <span className="message-content"
                  dangerouslySetInnerHTML={{ __html: this.markdown(this.state.deleteMessage.content) }}>
                </span>
              </p>
            </div>
          </div>
        </article>
      )
    }

    return (
      <div id="room-message-list" onScroll={e => this.scrollUp(e)}>
        {head}
        {this.showMessageList()}
        <Modal contentLabel="メッセージメニュー" style={customStyles} isOpen={!!this.state.selectMessage}
          onRequestClose={e => this.cancelSelectMessage(e) }>
          <div className="menu" role="menu">
            <ul className="menu-list">
              <li><a>(仮)メッセージメニュー</a></li>
              {editMessageMenu}
            </ul>
          </div>
        </Modal>
        <Modal contentLabel="メッセージの削除" style={deleteConfirmStyles}
          isOpen={!!this.state.deleteMessage} onRequestClose={e => this.cancelDeleteMessage(e) }>
          <div className="content delete-message-confirm">
            <h3 className="header">
              メッセージの削除
              <a onClick={e => this.cancelDeleteMessage(e) }><i className="fas fa-times"></i></a>
            </h3>
            <p>このメッセージを削除しますか？この操作は元に戻すことができません</p>
            <div className="content message-container">
              {deleteMessage}
            </div>
            <nav className="level">
              <div className="level-left">
              </div>
              <div className="level-right">
                <div className="level-item">
                  <a className="button" onClick={e => this.cancelDeleteMessage(e) }>キャンセル</a>
                </div>
                <div className="level-item">
                  <a className="button is-danger" onClick={e => this.deleteMessage(e)}>削除</a>
                </div>
              </div>
            </nav>
          </div>
        </Modal>
      </div>
    )
  }
}

export default RoomMessageList
