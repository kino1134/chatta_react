import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

import TopMessage from '../TopMessage'
import InputMessage from '../InputMessage'
import { openPopup, listenPopup } from '../../services/oAuthLogin'

class Login extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      token: "",
      userId: "",
      topMessage: "",
      inputMessages: [],
      password: ""
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  oAuthLogin (e, endpoint) {
    const popup = openPopup(endpoint)
    listenPopup(popup)
      .then(value => {
        // TODO: ローカルストレージに保存 & 中へリダイレクト
        this.setState({ token: value.token })
      })
    .catch(err => {
      // TODO: メッセージ表示
      console.log(err)
    })
  }

  passwordLogin (e) {
    e.preventDefault()
    // TODO: フェッチ処理を共通化したい
    fetch('/api/auth/password', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId: this.state.userId, password: this.state.password })
    }).then(res => {
      res.json().then(data => {
        if (res.ok) {
          // TODO: ローカルストレージに保存 & 中へリダイレクト
          this.setState({ token: data.token })
        } else {
          // TODO: メッセージの表示処理を共通化したい
          this.setState({ topMessage: data.message, inputMessages: data.errors })
        }
      })
    }).catch(err => {
      // TODO: メッセージ表示
      console.log(err)
    })
  }

  // TODO: 共通的に持ちたい
  isError (name) {
    if (!this.state.inputMessages) return ''
    return this.state.inputMessages.find(e => e.param === name) ? 'is-danger' : ''
  }

  render() {
    return (
      <section id="app" className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="column is-6 is-offset-3">
              <h3 className="title has-text-grey has-text-centered">ログイン</h3>
              <div>{this.state.token}</div>
              <div className="box">
                <div className="field">
                  <div className="buttons oauth-buttons is-centered">
                    <button onClick={(e) => this.oAuthLogin(e, '/api/auth/google')} className="button is-link is-large" tabIndex="0">
                      <span className="icon">
                        <i className="fab fa-google"></i>
                      </span>
                      <span>でログイン</span>
                    </button>
                    <button onClick={(e) => this.oAuthLogin(e, '/api/auth/github')} className="button is-info is-large" tabIndex="0">
                      <span className="icon">
                        <i className="fab fa-github"></i>
                      </span>
                      <span>でログイン</span>
                    </button>
                  </div>
                </div>
                <hr/>
                <TopMessage message={this.state.topMessage} color="danger"/>
                <form onSubmit={(e) => this.passwordLogin(e)}>
                  <div className="field">
                    <div className="control">
                      <input name="userId" className={['input', this.isError('userId')].join(' ')} type="text" placeholder="ID" autoFocus onChange={this.changeHandler} />
                    </div>
                    <InputMessage name="userId" color="danger" errors={this.state.inputMessages}/>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input name="password" className={['input', this.isError('password')].join(' ')} type="password" placeholder="パスワード" onChange={this.changeHandler} />
                    </div>
                    <InputMessage name="password" color="danger" errors={this.state.inputMessages}/>
                  </div>
                  <div className="field">
                    <div className="control has-text-centered">
                      <button type="submit" className="button is-primary is-medium" tabIndex="0">ログイン</button>
                    </div>
                  </div>
                </form>
              </div>
              <p className="has-text-grey has-text-centered">
                <Link to="/signup">ユーザ登録</Link>&nbsp; /&nbsp;
                <a href="../">パスワードを忘れた？</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Login
