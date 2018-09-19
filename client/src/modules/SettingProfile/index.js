import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import './index.css'

import apiHandler from '../../helpers/apiHandler'

import ButtonField from '../ButtonField'
import TopMessage from '../TopMessage'
import TextInput from '../TextInput'

import api from '../../services/api'

class SettingProfile extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      displayName: this.props.loginUser.displayName,
      email: this.props.loginUser.email,
      userId: this.props.loginUser.userId,
      photo: this.props.loginUser.photo
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  updateProfile (e) {
    if (this.props.preventExecute()) return

    const { displayName, email, userId, photo } = this.state
    api.putJson('/api/users/profile', {displayName, email, userId, photo}).then(res => {
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
    const { topMessage, inputMessages, messageColor, executing } = this.props
    return (
      <div id="setting-profile">
        <Helmet title="プロフィール設定 | chatta" />

        <TopMessage message={topMessage} color={messageColor}/>

        <TextInput name="displayName" label="名前" placeholder="名前" required autoFocus
          value={this.state.displayName} onChange={this.changeHandler} errors={inputMessages}>
        </TextInput>
        <TextInput name="email" label="メールアドレス" placeholder="メールアドレス" required
          value={this.state.email} onChange={this.changeHandler} errors={inputMessages}>
        </TextInput>
        <TextInput name="userId" label="ID" placeholder="ID" required icon="fas fa-at"
          value={this.state.userId} onChange={this.changeHandler} errors={inputMessages}>
        </TextInput>
        <TextInput name="photo" label="プロフィール写真" placeholder="プロフィール写真" required
          value={this.state.photo} onChange={this.changeHandler} errors={inputMessages}>
        </TextInput>
        <ButtonField align="center" className="is-info" loading={executing}
          onClick={(e) => this.updateProfile(e)}>
          変更
        </ButtonField>
      </div>
    )
  }
}

export default apiHandler(SettingProfile)
