import React, { Component } from 'react'

class RoomMessageEdit extends Component {
  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      inputText: this.props.editMessage.content
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  editEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.props.onEditMessage(e, this.state.inputText)
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
              <textarea name="inputText" placeholder="メッセージを編集" className="textarea" autoFocus
                value={this.state.inputText} rows={this.rows()}
                onChange={this.changeHandler} onKeyDown={(e) => this.editEnter(e)} >
              </textarea>
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
