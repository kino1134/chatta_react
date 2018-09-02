import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

class Login extends Component {
  render() {
    return (
  <section id="app" className="hero is-fullheight">
    <div className="hero-body">
      <div className="container">
        <div className="column is-6 is-offset-3">
          <h3 className="title has-text-grey has-text-centered">Login</h3>
          <div className="box">
            <div className="field">
              <div className="control has-text-centered">
                <button className="button is-link is-large" tabIndex="0" style={{ marginRight: 10 + 'px' }}>
                  <span className="icon">
                    <i className="fab fa-google"></i>
                  </span>
                  <span>でログイン</span>
                </button>
                <button className="button is-info is-large" tabIndex="0">
                  <span className="icon">
                    <i className="fab fa-github"></i>
                  </span>
                  <span>でログイン</span>
                </button>
              </div>
            </div>
            <hr/>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="ID" autoFocus="" />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input className="input" type="password" placeholder="パスワード" />
              </div>
            </div>
            <div className="field">
              <div className="control has-text-centered">
                <button className="button is-primary is-medium" tabIndex="0">ログイン</button>
              </div>
            </div>
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
