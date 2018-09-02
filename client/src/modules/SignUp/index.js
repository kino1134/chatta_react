import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class SignUp extends Component {
  render () {
    return (
      <section id="app" className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="column is-6 is-offset-3">
              <h3 className="title has-text-grey has-text-centered">ユーザ登録</h3>
              <div className="box">
                <div className="field">
                  <div className="control">
                    <input className="input is-large" type="text" placeholder="メールアドレス" autoFocus/>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <input className="input is-large" type="text" placeholder="ID"/>
                  </div>
                  <p className="help">※英数字とアンダーバー(_)のみ使用出来ます。</p>
                </div>
                <div className="field">
                  <div className="control">
                    <input className="input is-large" type="text" placeholder="名前"/>
                  </div>
                </div>
                <div className="field">
                  <div className="control has-text-centered">
                    <button className="button is-primary is-large">登録</button>
                  </div>
                </div>
              </div>
              <p className="has-text-grey has-text-centered">
                <Link to="/">戻る</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default SignUp
