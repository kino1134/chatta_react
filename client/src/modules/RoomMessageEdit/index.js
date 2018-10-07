import React, { Component } from 'react'

import RoomPostTextarea from '../RoomPostTextarea'

class RoomMessageEdit extends Component {
  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)
    this.enter = this.enter.bind(this)

    this.state = {
      inputText: this.props.editMessage.content
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  enter (e) {
    this.props.onEditMessage(e, this.state.inputText)
  }

  render () {
    const message = this.props.editMessage

    // TODO: 入力中表示ができてない
    return (
      <article className="media" style={{backgroundColor: '#fff5df'}}>
        <figure className="media-left">
          <p className="image avator">
            <img src={message.user.photo} alt={message.user.displayName} />
          </p>
        </figure>
        <div className="media-content">
          <div className="field">
            <div className="control">
              <RoomPostTextarea name="inputText" placeholder="メッセージを編集" text={this.state.inputText}
                loginUser={this.props.loginUser} onChange={this.changeHandler} onEnter={this.enter}
              />
            </div>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <a className="button" onClick={e => this.props.onCancelEditMessage(e)}>キャンセル</a>
              </div>
              <div className="level-item">
                <a className={`button is-success ${this.props.editing ? 'is-loading': ''}`}
                  onClick={e => this.props.onEditMessage(e, this.state.inputText)}>変更</a>
              </div>
            </div>
          </nav>
        </div>
      </article>
    )
  }
}

export default RoomMessageEdit
