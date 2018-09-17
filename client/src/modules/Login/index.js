import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import './Login.css'

import AuthenticateLayout from '../AuthenticateLayout'
import ButtonField from '../ButtonField'
import TopMessage from '../TopMessage'
import TextInput from '../TextInput'

import config from '../../constants'
import { openPopup, listenPopup } from '../../services/oAuthLogin'
import api from '../../services/api'
import { setAccessToken } from '../../services/storage'

class Login extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      topMessage: "",
      color: "danger",
      inputMessages: [],
      loggingIn: false,
      executing: false,
      userId: "",
      password: ""
    }

    // flashメッセージの表示
    // TODO: うまいやり方を考える
    if (this.props.history.location.state) {
      const flash = this.props.history.location.state
      this.state = Object.assign(this.state, flash)
    }

  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  oAuthLogin (e, endpoint) {
    // 処理中であるかの判断
    if (this.state.logginIn) {
      return false
    }

    // 処理中フラグを立てる
    this.setState({ loggingIn: true, executing: true })

    // 認証用の別窓を開けて、待ち合わせる
    const popup = openPopup(config.api.uri + endpoint)
    listenPopup(popup)
      .then(value => {
        setAccessToken(value.token)
        window.location.href = '/'
      })
    .catch(err => {
      this.setState({ topMessage: err.message })
    // 処理中フラグを戻す
    }).then(() => this.setState({ loggingIn: false, executing: false }))
  }

  passwordLogin (e) {
    e.preventDefault()

    // 処理中であるかの判断
    if (this.state.executing) {
      return false
    }

    // 処理中フラグを立てる
    this.setState({ executing: true })

    const { userId, password } = this.state
    api.postJson('/api/auth/password', { userId, password }).then(res => {
      if (res.ok) {
        setAccessToken(res.data.token)
        window.location.href = '/'
      } else {
        this.setState({ topMessage: res.data.message, inputMessages: res.data.errors })
      }
    }).catch(err => {
      console.log(err)
      this.setState({ topMessage: 'ログインに失敗しました' })
    // 処理中フラグを戻す
    }).then(() => this.setState({ executing: false }))
  }

  render() {
    return (
      <AuthenticateLayout>
        <Helmet title="ログイン | chatta" />

        <h3 className="title has-text-grey has-text-centered">ログイン</h3>
        <div id="login" className={`box ${this.state.loggingIn ? 'is-loggingIn' : ''}`}>
          <div className="field">
            <div className="buttons oauth-buttons is-centered">
              <button className="button is-link is-large"
                onClick={(e) => this.oAuthLogin(e, '/api/auth/google')}>
                <span className="icon"><i className="fab fa-google"></i></span>
                <span>でログイン</span>
              </button>
              <button className="button is-info is-large"
                onClick={(e) => this.oAuthLogin(e, '/api/auth/github')}>
                <span className="icon"><i className="fab fa-github"></i></span>
                <span>でログイン</span>
              </button>
            </div>
          </div>

          <hr/>

          <TopMessage message={this.state.topMessage} color={this.state.color} />
          <form onSubmit={(e) => this.passwordLogin(e)} className="field">
            <TextInput name="userId" placeholder="ID" autoFocus
              onChange={this.changeHandler} errors={this.state.inputMessages} />
            <TextInput name="password" type="password" placeholder="パスワード"
              onChange={this.changeHandler} errors={this.state.inputMessages} />
            <ButtonField type="submit" align="center" className="is-primary is-medium is-fullwidth"
              loading={this.state.executing}>
              ログイン
            </ButtonField>
          </form>

          <div className="has-text-grey has-text-centered">
            <ul>
              <li><Link to="/signup">ユーザ登録</Link></li>
              <li><Link to="/password-init">パスワードを忘れた？</Link></li>
            </ul>
          </div>
        </div>
      </AuthenticateLayout>
    )
  }
}

export default withRouter(Login)
