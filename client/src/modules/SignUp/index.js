import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class SignUp extends Component {
  render () {
    return (
      <section id="app" className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div class="column is-6 is-offset-3">
              <h3 class="title has-text-grey has-text-centered">ユーザ登録</h3>
              <div class="box">
                <div class="field">
                  <div class="control">
                    <input className="input is-large" type="text" placeholder="メールアドレス" autofocus=""/>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <input className="input is-large" type="text" placeholder="ID"/>
                  </div>
                  <p class="help">※英数字とアンダーバー(_)のみ使用出来ます。</p>
                </div>
                <div class="field">
                  <div class="control">
                    <input className="input is-large" type="text" placeholder="名前"/>
                  </div>
                </div>
                <div class="field">
                  <div class="control has-text-centered">
                    <button className="button is-primary is-large">登録</button>
                  </div>
                </div>
              </div>
              <p class="has-text-grey has-text-centered">
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
