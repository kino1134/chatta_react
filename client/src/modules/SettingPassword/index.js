import React, { Component } from 'react'
import './index.css'

import TopMessage from '../TopMessage'
import TextInput from '../TextInput'

import api from '../../services/api'

class SettingPassword extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      current: "",
      newer: "",
      confirm: "",
      executing: false,
      topMessage: "",
      messageColor: "",
      inputMessages: []
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  updatePassword (e) {
    if (this.state.executing) return false

    this.setState({ executing: true })

    const { current, newer, confirm } = this.state
    api.put('/api/users/password', {current, newer, confirm}).then(res => {
      res.json().then(data => {
        this.setState({ topMessage: data.message, inputMessages: data.errors })
        if (res.ok) {
          this.setState({ messageColor: 'info' })
        } else {
          this.setState({ messageColor: 'danger' })
        }
      }).catch (err => { console.log(err) })
    }).catch(err => { console.log(err) })
      .then(() => this.setState({ executing: false }))
  }

  render () {
    // パスワードを所持していないユーザの場合、この画面を表示させない
    if (!this.props.loginUser.password) return null

    return (
      <div id="setting-password">
        <TopMessage message={this.state.topMessage} color={this.state.messageColor}/>
        <TextInput name="current" type="password" label="今のパスワード"
          placeholder="今のパスワード" required autoFocus
          onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <TextInput name="newer" type="password" label="新しいパスワード"
          placeholder="新しいパスワード" required
          onChange={this.changeHandler} errors={this.state.inputMessages}>
          <p className="help">8文字以上で大小英文字と数字を組み合わせてください</p>
        </TextInput>
        <TextInput name="confirm" type="password" label="新しいパスワード（確認）"
          placeholder="新しいパスワード（確認）" required
          onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <div className="field">
          <div className="control has-text-centered">
            <button onClick={(e) => this.updatePassword(e)}
              className={'button is-info' + (this.state.executing ? ' is-loading' : '')}
              disabled={this.state.executing}>
              変更
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SettingPassword
