import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RoomLoading from '../RoomLoading'

import { loggedIn } from '../../services/storage'
import socket from '../../services/socket'
import * as loginUserActions from '../../actions/loginUser'
import api from '../../services/api'

class LoginCheck extends Component {

  componentDidMount () {
    const { loginUser, setLoginUser } = this.props
    // ログイン済みの場合、何もしない
    if (loginUser) return

    api.getJson('/api/users/me').then(res => {
      if (res.ok) {
        setLoginUser(res.data)
        socket.open()
      } else {
        window.location.href = '/authenticate'
      }
    }).catch(err => { console.log(err) })
  }

  render () {
    // アクセストークンがない場合、ログイン画面に戻る
    if (!loggedIn()) {
      window.location.href = '/authenticate'
      return null
    }

    const { loginUser, children } = this.props
    if (loginUser) {
      return (<Fragment>{children}</Fragment>)
    } else {
      return (<RoomLoading />)
    }
  }
}

export default withRouter(connect(
  state => ({ loginUser: state.loginUser }),
  { setLoginUser: loginUserActions.setLoginUser }
)(LoginCheck))
