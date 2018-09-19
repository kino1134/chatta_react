import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import './index.css'

import apiHandler from '../../helpers/apiHandler'

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
      confirm: ""
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  updatePassword (e) {
    if (this.props.preventExecute()) return

    const { current, newer, confirm } = this.state
    api.putJson('/api/users/password', {current, newer, confirm}).then(res => {
      this.props.setTopMessage(res.data.message)
      this.props.setInputMessages(res.data.errors)
      this.props.setMessageColor(res.ok ? 'info' : 'danger')
    }).catch(err => {
      console.log(err)
      this.props.setTopMessage('変更できませんでした')
      this.props.setMessageColor('danger')
    }).then(() => this.props.endExecute() )
  }

  render () {
    // パスワードを所持していないユーザの場合、この画面を表示させない
    if (!this.props.loginUser.password) return null

    const { topMessage, inputMessages, messageColor, executing } = this.props
    return (
      <div id="setting-password">
        <Helmet title="パスワード変更 | chatta" />

        <TopMessage message={topMessage} color={messageColor}/>

        <TextInput name="current" type="password" label="今のパスワード"
          placeholder="今のパスワード" required autoFocus
          onChange={this.changeHandler} errors={inputMessages}>
        </TextInput>
        <TextInput name="newer" type="password" label="新しいパスワード"
          placeholder="新しいパスワード" required
          onChange={this.changeHandler} errors={inputMessages}>
          <p className="help">8文字以上で大小英字と数字を組み合わせてください</p>
        </TextInput>
        <TextInput name="confirm" type="password" label="新しいパスワード（確認）"
          placeholder="新しいパスワード（確認）" required
          onChange={this.changeHandler} errors={inputMessages}>
        </TextInput>
        <ButtonField align="center" className="is-info" loading={executing}
          onClick={(e) => this.updatePassword(e)}>
          変更
        </ButtonField>
      </div>
    )
  }
}

export default apiHandler(SettingPassword)
