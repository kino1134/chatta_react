import React, { Component } from 'react'
import './index.css'

import api from '../../services/api'

class RoomPost extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      text: ""
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  rows () {
    const num = this.state.text.split('\n').length
    if (num < 1) {
      return 1
    } else if (num >= 5) {
      return 5
    } else {
      return num
    }
  }

  noInput () {
    return !/\S/.test(this.state.text)
  }

  posting (e) {
    api.post('/api/messages', { content: this.state.text }).then(res => {
      res.json().then(json => {
        console.log(json)
        if (res.ok) {
          this.setState({ text: "" })
        } else {
          // TODO: エラー処理
        }
      })
    }).catch(err => { console.log(err) })
  }

  postEnter (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      this.posting(e)
    }
  }

  render () {
    return (
      <footer id="room-post">
        <div className="field has-addons">
          <p className="control main">
            <textarea name="text" className="textarea" placeholder="メッセージ" autoFocus rows={this.rows()}
              value={this.state.text} onChange={this.changeHandler} onKeyDown={(e) => this.postEnter(e)}>
            </textarea>
          </p>
          <p className="control">
            <button className="button is-success"
              onClick={(e) => this.posting(e)} disabled={this.noInput()}>
              <i className="fas fa-comment-dots fa-lg"></i>
            </button>
          </p>
        </div>
      </footer>
    )
  }
}

export default RoomPost
