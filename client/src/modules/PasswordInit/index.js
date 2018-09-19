import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import apiHandler from '../../helpers/apiHandler'

import AuthenticateLayout from '../AuthenticateLayout'
import ButtonField from '../ButtonField'
import TopMessage from '../TopMessage'
import TextInput from '../TextInput'

import api from '../../services/api'

class PasswordInit extends Component {

  constructor (props) {
    super(props)

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      email: "",
      userId: ""
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillUnmount () {
    this._isMounted = false
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  initPassword (e) {
    if (this.props.preventExecute()) return

    const { email, userId } = this.state
    api.putJson('/api/users/password/init', { email, userId }).then(res => {
      if (res.ok) {
        this.props.history.push('/', {
          topMessage: 'パスワードを初期化しました。メールを確認してログインしてください',
          color: 'info'
        })
      } else {
        this.props.setTopMessage(res.data.message)
        this.props.setInputMessages(res.data.errors)
      }
    }).catch(err => {
      console.log(err)
      this.props.setTopMessage('初期化できませんでした')
    }).then(() => {
      if (this._isMounted) this.props.endExecute()
    })
  }

  render () {
    const { topMessage, inputMessages, executing } = this.props
    return (
      <AuthenticateLayout>
        <Helmet title="パスワード初期化 | chatta" />

        <h3 className="title has-text-grey has-text-centered">パスワード初期化</h3>
        <div className="box">
          <TopMessage message={topMessage} color="danger"/>
          <TextInput name="email" placeholder="メールアドレス" className="is-medium" required autoFocus
            onChange={this.changeHandler} errors={inputMessages}>
          </TextInput>
          <TextInput name="userId" placeholder="ID" className="is-medium" required
            onChange={this.changeHandler} errors={inputMessages}>
          </TextInput>
          <ButtonField align="center" className="is-primary is-medium is-fullwidth"
            onClick={(e) => this.initPassword(e)} loading={executing}>
            初期化
          </ButtonField>
          <p className="has-text-grey has-text-centered">
            <Link to="/">戻る</Link>
          </p>
        </div>
      </AuthenticateLayout>
    )
  }
}

export default apiHandler(withRouter(PasswordInit))
