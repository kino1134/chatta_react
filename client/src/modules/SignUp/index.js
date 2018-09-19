import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import apiHandler from '../../helpers/apiHandler'

import AuthenticateLayout from '../AuthenticateLayout'
import ButtonField from '../ButtonField'
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
      displayName: ""
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
    if (this.props.preventExecute()) return

    const { email, userId, displayName } = this.state
    api.postJson('/api/users', { email, userId, displayName }).then(res => {
      if (res.ok) {
        this.props.history.push('/', {
          topMessage: 'ユーザが登録されました。メールを確認してログインしてください',
          color: 'info'
        })
      } else {
        this.props.setTopMessage(res.data.message)
        this.props.setInputMessages(res.data.errors)
      }
    }).catch(err => {
      console.log(err)
      this.props.setTopMessage('ユーザ登録できませんでした')
    }).then(() => {
      if (this._isMounted) this.props.endExecute()
    })
  }

  render () {
    const { topMessage, inputMessages, executing } = this.props
    return (
      <AuthenticateLayout>
        <Helmet title="ユーザ登録 | chatta" />

        <h3 className="title has-text-grey has-text-centered">ユーザ登録</h3>
        <div className="box">
          <TopMessage message={topMessage} color="danger"/>
          <TextInput name="email" placeholder="メールアドレス" className="is-medium" required autoFocus
            onChange={this.changeHandler} errors={inputMessages}>
          </TextInput>
          <TextInput name="userId" placeholder="ID" className="is-medium" required
            onChange={this.changeHandler} value={this.state.userId} errors={inputMessages}>
            <p className="help">※英数字とアンダーバー(_)のみ使用できます</p>
          </TextInput>
          <TextInput name="displayName" placeholder="名前" className="is-medium" required
            onChange={this.changeHandler} errors={inputMessages}>
          </TextInput>
          <ButtonField align="center" className="is-primary is-medium is-fullwidth"
            loading={executing} onClick={(e) => this.callSignUp(e)}>
            登録
          </ButtonField>
          <p className="has-text-grey has-text-centered">
            <Link to="/">戻る</Link>
          </p>
        </div>
      </AuthenticateLayout>
    )
  }
}

export default apiHandler(withRouter(SignUp))
