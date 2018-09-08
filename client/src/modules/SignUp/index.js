import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import TopMessage from '../TopMessage'
import TextInput from '../TextInput'

import api from '../../services/api'

class SignUp extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      email: "",
      userId: "",
      displayName: "",
      executing: false,
      topMessage: "",
      inputMessages: []
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillUnmount () {
    this._isMounted = false
  }

  changeHandler (e) {
    // メールアドレスの内容をID欄に連携する
    if (e.target.name === 'email') {
      const name = this.emailName(this.state.email)
      if (name === this.state.userId) {
        this.setState({ userId: this.emailName(e.target.value) })
      }
    }

    this.setState({ [e.target.name]: e.target.value })
  }

  emailName (email) {
    return email.split('@')[0].replace(/[^\w\d_]/g, '')
  }

  callSignUp (e) {
    if (this.state.executing) return false

    this.setState({ executing: true })

    const { email, userId, displayName } = this.state
    api.post('/api/users', { email, userId, displayName }).then(res => {
      res.json().then(data => {
        if (res.ok) {
          this.props.history.push('/', {
            topMessage: 'ユーザが登録されました。メールを確認してログインしてください',
            color: 'info'
          })
        } else {
          this.setState({ topMessage: data.message, inputMessages: data.errors })
        }
      })
    }).catch(err => {
      console.log(err)
      this.setState({ topMessage: 'ユーザ登録できませんでした' })
    }).then(() => {
      if (this._isMounted) this.setState({ executing: false })
    })
  }

  render () {
    return (
      <section id="sign-up" className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="column is-4 is-offset-4">
              <h3 className="title has-text-grey has-text-centered">ユーザ登録</h3>
              <div className="box">
                <TopMessage message={this.state.topMessage} color="danger"/>
                <TextInput name="email" placeholder="メールアドレス" className="is-medium" required autoFocus
                  onChange={this.changeHandler} errors={this.state.inputMessages}
                />
                <TextInput name="userId" placeholder="ID" className="is-medium" required
                  onChange={this.changeHandler} value={this.state.userId} errors={this.state.inputMessages}>
                  <p className="help">※英数字とアンダーバー(_)のみ使用できます</p>
                </TextInput>
                <TextInput name="displayName" placeholder="名前" className="is-medium" required
                  onChange={this.changeHandler} errors={this.state.inputMessages}
                />
                <div className="field">
                  <div className="control has-text-centered">
                    <button onClick={(e) => this.callSignUp(e)}
                      className={'button is-primary is-large' + (this.state.executing ? ' is-loading' : '')}
                      disabled={this.state.executing}>
                      登録
                    </button>
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

export default withRouter(SignUp)
