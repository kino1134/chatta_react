import React, { Component } from 'react'
import './index.css'

class RoomPost extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      message: ""
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  rows () {
    const num = this.state.message.split('\n').length
    if (num < 1) {
      return 1
    } else if (num >= 5) {
      return 5
    } else {
      return num
    }
  }

  render () {
    return (
      <footer id="room-post">
        <div className="field has-addons">
          <p className="control main">
            <textarea name="message" className="textarea" placeholder="メッセージ"
              rows={this.rows()} onChange={this.changeHandler}>
            </textarea>
          </p>
          <p className="control">
            <button className="button is-success">
              <i className="fas fa-comment-dots fa-lg"></i>
            </button>
          </p>
        </div>
      </footer>
    )
  }
}

export default RoomPost
