import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import './index.css'

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
      photo: this.props.loginUser.photo,
      executing: false,
      topMessage: "",
      messageColor: "",
      inputMessages: []
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  updateProfile (e) {
    if (this.state.executing) return false

    this.setState({ executing: true })

    const { displayName, email, userId, photo } = this.state
    api.put('/api/users/profile', {displayName, email, userId, photo}).then(res => {
      res.json().then(data => {
        this.setState({ topMessage: data.message, inputMessages: data.errors })
        if (res.ok) {
          this.setState({ messageColor: 'info' })
        } else {
          this.setState({ messageColor: 'danger' })
        }
      }).catch (err => { console.log(err) })
    }).catch(err => { console.log(err) })
      .then(() => this.props.updateLoginUser({ displayName, email, userId, photo }))
      .then(() => this.setState({ executing: false }))
  }

  render () {
    return (
      <div id="setting-profile">
        <Helmet title="プロフィール設定 | chatta" />
        <TopMessage message={this.state.topMessage} color={this.state.messageColor}/>
        <TextInput name="displayName" label="名前" placeholder="名前" required autoFocus
          value={this.state.displayName} onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <TextInput name="email" label="メールアドレス" placeholder="メールアドレス" required
          value={this.state.email} onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <TextInput name="userId" label="ID" placeholder="ID" required icon="fas fa-at"
          value={this.state.userId} onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <TextInput name="photo" label="プロフィール写真" placeholder="プロフィール写真" required
          value={this.state.photo} onChange={this.changeHandler} errors={this.state.inputMessages}>
        </TextInput>
        <div className="field">
          <div className="control has-text-centered">
            <button onClick={(e) => this.updateProfile(e)}
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

export default SettingProfile
