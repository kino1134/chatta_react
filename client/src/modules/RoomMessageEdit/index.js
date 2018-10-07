import React, { Component } from 'react'

import withFocus from '../../helpers/withFocus'

import RoomPostTextarea from '../RoomPostTextarea'
import EmojiPicker from '../EmojiPicker'

class RoomMessageEdit extends Component {
  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)
    this.enter = this.enter.bind(this)

    this.state = {
      inputText: this.props.editMessage.content,
      emojiPickerPosition: null
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  enter (e) {
    this.props.onEditMessage(e, this.state.inputText)
  }

  showEmojiPicker (e) {
    const main = document.getElementById('main')
    const position = {
      bottom: Math.min(main.clientHeight - e.clientY - 23, 320),
      right: main.clientWidth - e.clientX
    }
    this.setState({ emojiPickerPosition: position })
  }

  render () {
    const message = this.props.editMessage

    return (
      <article className="media" style={{backgroundColor: '#fff5df'}}>
        <figure className="media-left">
          <p className="image avator">
            <img src={message.user.photo} alt={message.user.displayName} />
          </p>
        </figure>
        <div className="media-content">
          <div className={`room-post-area field has-addons ${this.props.getFocusClass()}`}>
            <p className="control main">
              <RoomPostTextarea name="inputText" placeholder="メッセージを編集" text={this.state.inputText}
                loginUser={this.props.loginUser} onChange={this.changeHandler} onEnter={this.enter}
                onFocus={this.props.setFocus} onBlur={this.props.setBlur}
              />
            </p>
            <p className="control">
              <button className={`button`} onClick={e => this.showEmojiPicker(e) }>
                <i className="far fa-smile fa-lg"></i>
              </button>
              <EmojiPicker position={this.state.emojiPickerPosition}
                onRequestClose={e => this.setState({ emojiPickerPosition: null }) }
                selectEmoji={k => this.setState({ inputText: `${this.state.inputText} ${k} ` }) }
              />
            </p>
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

export default withFocus({ stateName: 'focusTextArea', className: 'has-focus' })(RoomMessageEdit)
