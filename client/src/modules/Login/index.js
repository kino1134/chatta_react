import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './Login.css'

import TopMessage from '../TopMessage'
import TextInput from '../TextInput'

import config from '../../constants'
import { openPopup, listenPopup } from '../../services/oAuthLogin'
import api from '../../services/api'
import storage from '../../services/storage'

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
        storage.setAccessToken(value.token)
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
    api.post('/api/auth/password', JSON.stringify({ userId, password })).then(res => {
      res.json().then(data => {
        if (res.ok) {
          storage.setAccessToken(data.token)
          window.location.href = '/'
        } else {
          this.setState({ topMessage: data.message, inputMessages: data.errors })
        }
      })
    }).catch(err => {
      console.log(err)
      this.setState({ topMessage: 'ログインに失敗しました' })
    // 処理中フラグを戻す
    }).then(() => this.setState({ executing: false }))
  }

  render() {
    return (
      <section id="app" className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="column is-6 is-offset-3">
              <h3 className="title has-text-grey has-text-centered">ログイン</h3>
              <div className={['box', this.state.loggingIn ? 'is-loggingIn' : ''].join(' ')}>
                <div className="field">
                  <div className="buttons oauth-buttons is-centered">
                    <button onClick={(e) => this.oAuthLogin(e, '/api/auth/google')} className="button is-link is-large" tabIndex="0">
                      <span className="icon"><i className="fab fa-google"></i></span>
                      <span>でログイン</span>
                    </button>
                    <button onClick={(e) => this.oAuthLogin(e, '/api/auth/github')} className="button is-info is-large" tabIndex="0">
                      <span className="icon"><i className="fab fa-github"></i></span>
                      <span>でログイン</span>
                    </button>
                  </div>
                </div>

                <hr/>

                <TopMessage message={this.state.topMessage} color={this.state.color} />
                <form onSubmit={(e) => this.passwordLogin(e)}>
                  <TextInput name="userId" placeholder="ID" autoFocus
                    onChange={this.changeHandler} errors={this.state.inputMessages}
                  />
                  <TextInput name="password" placeholder="パスワード"
                    onChange={this.changeHandler} errors={this.state.inputMessages}
                  />
                  <div className="field">
                    <div className="control has-text-centered">
                      <button type="submit" tabIndex="0"
                        className={'button is-primary is-medium' + (this.state.executing ? ' is-loading' : '')}
                        disabled={this.state.executing}>
                        ログイン
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <p className="has-text-grey has-text-centered">
                <Link to="/signup">ユーザ登録</Link>&nbsp; /&nbsp;
                <Link to="/">パスワードを忘れた？</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default withRouter(Login)
