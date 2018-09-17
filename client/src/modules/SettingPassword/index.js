import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import './index.css'

import ButtonField from '../ButtonField'
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
    api.putJson('/api/users/password', {current, newer, confirm}).then(res => {
      this.setState({ topMessage: res.data.message, inputMessages: res.data.errors })
      if (res.ok) {
        this.setState({ messageColor: 'info' })
      } else {
        this.setState({ messageColor: 'danger' })
      }
    }).catch(err => { console.log(err) })
      .then(() => this.setState({ executing: false }))
  }

  render () {
    // パスワードを所持していないユーザの場合、この画面を表示させない
    if (!this.props.loginUser.password) return null

    return (
      <div id="setting-password">
        <Helmet title="パスワード変更 | chatta" />

        <TopMessage message={this.state.topMessage} color={this.state.messageColor}/>

        <TextInput name="current" type="password" label="今のパスワード"
          placeholder="今のパスワード" required autoFocus
          onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <TextInput name="newer" type="password" label="新しいパスワード"
          placeholder="新しいパスワード" required
          onChange={this.changeHandler} errors={this.state.inputMessages}>
          <p className="help">8文字以上で大小英字と数字を組み合わせてください</p>
        </TextInput>
        <TextInput name="confirm" type="password" label="新しいパスワード（確認）"
          placeholder="新しいパスワード（確認）" required
          onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <ButtonField align="center" className="is-info" loading={this.state.executing}
          onClick={(e) => this.updatePassword(e)}>
          変更
        </ButtonField>
      </div>
    )
  }
}

export default SettingPassword
