import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

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
      userId: "",
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
    this.setState({ [e.target.name]: e.target.value })
  }

  initPassword (e) {
    if (this.state.executing) return false

    this.setState({ executing: true })

    const { email, userId } = this.state
    api.put('/api/users/password/init', { email, userId }).then(res => {
      res.json().then(data => {
        if (res.ok) {
          this.props.history.push('/', {
            topMessage: 'パスワードを初期化しました。メールを確認してログインしてください',
            color: 'info'
          })
        } else {
          this.setState({ topMessage: data.message, inputMessages: data.errors })
        }
      }).catch(err => { console.log(err) })
    }).catch(err => {
      console.log(err)
      this.setState({ topMessage: '初期化できませんでした' })
    }).then(() => {
      if (this._isMounted) this.setState({ executing: false })
    })
  }

  render () {
    return (
      <AuthenticateLayout>
        <Helmet title="パスワード初期化 | chatta" />

        <h3 className="title has-text-grey has-text-centered">パスワード初期化</h3>
        <div className="box">
          <TopMessage message={this.state.topMessage} color="danger"/>
          <TextInput name="email" placeholder="メールアドレス" className="is-medium" required autoFocus
            onChange={this.changeHandler} errors={this.state.inputMessages}
          />
          <TextInput name="userId" placeholder="ID" className="is-medium" required
            onChange={this.changeHandler} errors={this.state.inputMessages}>
          </TextInput>
          <ButtonField align="center" className="is-primary is-large"
            loading={this.state.executing} onClick={(e) => this.initPassword(e)}>
            初期化
          </ButtonField>
        </div>

        <p className="has-text-grey has-text-centered">
          <Link to="/">戻る</Link>
        </p>
      </AuthenticateLayout>
    )
  }
}

export default withRouter(PasswordInit)
